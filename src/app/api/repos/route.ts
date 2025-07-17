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
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const fetchAll = searchParams.get('fetch_all') === 'true';

    try {
        if (fetchAll) {
            // 모든 레포지토리 가져오기
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

                // 더 이상 레포지토리가 없으면 중단
                if (repos.length < 100) break;

                // 안전장치: 너무 많은 페이지를 가져오지 않도록 제한
                if (githubPage > 50) break;
            }

            // barim-data 레포는 제외하고 반환
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
        } else {
            // 페이지별 가져오기
            const currentPage = parseInt(page);
            const reposPerPage = 50;
            let allRepos: GitHubRepository[] = [];
            let githubPage = 1;

            // 요청된 페이지까지의 모든 레포지토리를 가져오기
            const targetRepoCount = currentPage * reposPerPage;

            while (allRepos.length < targetRepoCount) {
                const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
                    type: "owner",
                    sort: "updated",
                    per_page: 100,
                    page: githubPage,
                });

                if (repos.length === 0) break;

                allRepos = allRepos.concat(repos as GitHubRepository[]);
                githubPage++;

                // 더 이상 레포지토리가 없으면 중단
                if (repos.length < 100) break;

                // 안전장치: 너무 많은 페이지를 가져오지 않도록 제한
                if (githubPage > 50) break;
            }

            // barim-data 레포는 제외
            const filteredRepos = allRepos.filter(repo => repo.name !== PHYSICAL_REPO);

            // 현재 페이지에 해당하는 레포지토리들만 반환
            const startIndex = (currentPage - 1) * reposPerPage;
            const endIndex = startIndex + reposPerPage;
            const paginatedRepos = filteredRepos.slice(startIndex, endIndex);

            // 다음 페이지가 있는지 확인
            const hasNextPage = filteredRepos.length > endIndex;

            return NextResponse.json({
                repositories: paginatedRepos,
                meta: {
                    authSource: "header",
                    currentPage: currentPage,
                    reposPerPage,
                    returnedCount: paginatedRepos.length,
                    hasNextPage,
                    totalLoadedRepos: filteredRepos.length,
                    fetchAll: false,
                    note: "GitHub repositories (excluding barim-data)"
                }
            });
        }
    } catch (error) {
        console.error("Error fetching repositories:", error);
        return NextResponse.json({ message: "Error fetching repositories" }, { status: 500 });
    }
}
