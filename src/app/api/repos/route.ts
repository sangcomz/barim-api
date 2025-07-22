import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";

// 고정 레포지토리 이름 (물리적 저장소)
const PHYSICAL_REPO = "barim-data";

// GitHub 레포지토리 타입 정의
interface GitHubRepository {
    id: number;
    name: string;
    full_name: string;
    description?: string | null;
    updated_at: string;
}

// GET: 사용자의 모든 GitHub 레포지토리 목록 가져오기 (페이지네이션 지원)
export async function GET(request: Request) {
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ 
            message: "Not authenticated. Please provide a valid Authorization header." 
        }, { status: 401 });
    }
    
    const auth = authHeader.substring(7);
    const octokit = new Octokit({ auth });

    try {
        if (true) {
            let allRepos: GitHubRepository[] = [];
            let githubPage = 1;

            while (true) {
                const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
                    type: "owner",
                    sort: "updated",
                    per_page: 100,
                    page: githubPage,
                });

                if (repos.length === 0) break;

                allRepos = allRepos.concat(repos as GitHubRepository[]);
                githubPage++;

                if (repos.length < 100) break;

                if (githubPage > 50) break;
            }

            const filteredRepos = allRepos.filter(repo => repo.name !== PHYSICAL_REPO);

            return NextResponse.json({
                repositories: filteredRepos,
                meta: {
                    authSource: "header",
                    totalCount: filteredRepos.length,
                    fetchedPages: githubPage - 1,
                    fetchAll: true,
                    note: "All GitHub repositories (excluding barim-data)"
                }
            });
        }
    } catch (error: any) {
        console.error("Error fetching repositories:", error);
        
        // GitHub API 인증 관련 오류 처리
        if (error?.status === 401 || error?.response?.status === 401) {
            return NextResponse.json({ 
                message: "Invalid or expired GitHub token. Please check your authentication credentials." 
            }, { status: 401 });
        }
        
        if (error?.status === 403 || error?.response?.status === 403) {
            return NextResponse.json({ 
                message: "Access forbidden. Please check your GitHub token permissions." 
            }, { status: 403 });
        }

        return NextResponse.json({ message: "Error fetching repositories" }, { status: 500 });
    }
}
