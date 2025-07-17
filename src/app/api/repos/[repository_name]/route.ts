import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";

// GitHub 레포지토리 타입 정의
interface GitHubRepository {
    id: number;
    name: string;
    full_name: string;
    description?: string | null;
    updated_at: string;
}

// GET: 특정 이름의 GitHub 레포지토리 정보 가져오기
export async function GET(request: Request, { params }: { params: Promise<{ repository_name: string }> }) {
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({
            message: "Not authenticated. Please provide a valid Authorization header."
        }, { status: 401 });
    }
    
    const auth = authHeader.substring(7);
    const { repository_name } = await params;
    if (!repository_name) {
        return NextResponse.json({ message: "Repository name is required." }, { status: 400 });
    }

    const octokit = new Octokit({ auth });

    try {
        // 사용자가 소유한 모든 레포지토리 목록을 가져옵니다 (페이지네이션 지원)
        let allRepos: GitHubRepository[] = [];
        let githubPage = 1;
        let targetRepo: GitHubRepository | undefined;

        while (!targetRepo) {
            const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
                type: "owner",
                sort: "updated",
                per_page: 100,
                page: githubPage,
            });

            if (repos.length === 0) break;

            allRepos = allRepos.concat(repos as GitHubRepository[]);
            
            // 이름이 일치하는 레포지토리를 찾습니다.
            targetRepo = (repos as GitHubRepository[]).find(repo => repo.name === repository_name);
            
            if (targetRepo) break;

            githubPage++;

            // 더 이상 레포지토리가 없으면 중단
            if (repos.length < 100) break;

            // 안전장치: 너무 많은 페이지를 가져오지 않도록 제한
            if (githubPage > 50) break;
        }

        // 일치하는 레포지토리가 없는 경우 404 에러를 반환합니다.
        if (!targetRepo) {
            return NextResponse.json({ message: `Repository '${repository_name}' not found.` }, { status: 404 });
        }

        // 찾은 레포지토리 정보를 반환합니다.
        return NextResponse.json({
            repository: targetRepo,
            meta: {
                authSource: "header",
                searchedPages: githubPage,
                totalSearchedRepos: allRepos.length,
            }
        });

    } catch (error) {
        console.error("Error fetching repository:", error);
        return NextResponse.json({ message: "Error fetching repository" }, { status: 500 });
    }
}