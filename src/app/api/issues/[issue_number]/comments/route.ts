import {Octokit} from "@octokit/rest";
import {NextResponse} from "next/server";

// 고정 레포지토리 이름 (물리적 저장소)
const PHYSICAL_REPO = "barim-data";

// POST: barim-data 레포의 특정 이슈에 새로운 댓글 생성
export async function POST(
    request: Request,
    {params}: { params: Promise<{ issue_number: string }> }
) {
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({
            message: "Not authenticated. Please provide a valid Authorization header."
        }, {status: 401});
    }
    
    const auth = authHeader.substring(7);
    const octokit = new Octokit({auth});
    const {issue_number} = await params;
    const issue_number_int = parseInt(issue_number, 10);
    const {body} = await request.json();

    if (!body) {
        return NextResponse.json({message: "Comment body is required"}, {status: 400});
    }

    // 항상 물리적 저장소 사용 (repo 파라미터 무시)
    const repositoryName = PHYSICAL_REPO;

    try {
        const {data: user} = await octokit.rest.users.getAuthenticated();
        const owner = user.login;

        const {data: newComment} = await octokit.rest.issues.createComment({
            owner,
            repo: repositoryName,
            issue_number: issue_number_int,
            body,
        });

        return NextResponse.json({
            comment: newComment,
            meta: {
                authSource: "header",
                createdBy: owner,
                repository: repositoryName,
                issueNumber: issue_number_int
            }
        }, {status: 201});
    } catch (error: any) {
        console.error("Error creating comment:", error);
        
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

        return NextResponse.json(
            {message: "Error creating comment"},
            {status: 500}
        );
    }
}