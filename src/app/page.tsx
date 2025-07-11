export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Barim API</h1>
        <p className="text-xl text-gray-600 mb-2">External Plugin API Server</p>
        <p className="text-gray-500">Version 1.0.0 • GitHub-powered project management API</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <h3 className="font-semibold text-blue-800 mb-2">Authentication</h3>
        <p className="text-blue-700 text-sm mb-2">All requests require GitHub Personal Access Token</p>
        <code className="text-sm text-blue-900 bg-blue-100 px-2 py-1 rounded">
          Authorization: Bearer &lt;your-github-access-token&gt;
        </code>
      </div>

      <div className="space-y-8">
        {/* Projects */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Projects</h2>
          <div className="space-y-4">
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-green-50 px-4 py-3 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">GET</span>
                  <code className="text-sm font-mono">/api/projects</code>
                </div>
                <span className="text-sm text-gray-600">List all projects</span>
              </div>
              <div className="p-4">
                <p className="text-gray-700 mb-3">Retrieve all projects from GitHub labels with &quot;project:&quot; prefix</p>
                <div className="bg-gray-50 rounded p-3">
                  <h4 className="font-medium text-sm mb-2">Response Example:</h4>
                  <pre className="text-xs text-gray-700 overflow-x-auto">{`{
  "projects": [
    {
      "name": "barim-app",
      "label": "project:barim-app", 
      "color": "ededed",
      "description": "Project: barim-app",
      "issueCount": 24
    }
  ]
}`}</pre>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-blue-50 px-4 py-3 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">POST</span>
                  <code className="text-sm font-mono">/api/projects</code>
                </div>
                <span className="text-sm text-gray-600">Create new project</span>
              </div>
              <div className="p-4">
                <p className="text-gray-700 mb-3">Create a new project as GitHub label</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded p-3">
                    <h4 className="font-medium text-sm mb-2">Request Body:</h4>
                    <pre className="text-xs text-gray-700">{`{
  "projectName": "string",
  "description": "string?" 
}`}</pre>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <h4 className="font-medium text-sm mb-2">Response:</h4>
                    <pre className="text-xs text-gray-700">{`{
  "project": {
    "name": "MyProject",
    "label": "project:MyProject",
    "color": "ff5733",
    "issueCount": 0
  }
}`}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Issues */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Issues</h2>
          <div className="space-y-4">
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-green-50 px-4 py-3 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">GET</span>
                  <code className="text-sm font-mono">/api/issues</code>
                </div>
                <span className="text-sm text-gray-600">List issues for project</span>
              </div>
              <div className="p-4">
                <p className="text-gray-700 mb-3">Get paginated list of issues for specific project</p>
                <div className="mb-3">
                  <h4 className="font-medium text-sm mb-2">Query Parameters:</h4>
                  <div className="space-y-1 text-sm">
                    <div><code className="bg-gray-100 px-1 rounded">repo</code> <span className="text-red-500">*</span> - Project name to filter issues</div>
                    <div><code className="bg-gray-100 px-1 rounded">page</code> - Page number (default: 1)</div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <h4 className="font-medium text-sm mb-2">Example Request:</h4>
                  <code className="text-xs text-gray-700">GET /api/issues?repo=barim-app&page=1</code>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-blue-50 px-4 py-3 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">POST</span>
                  <code className="text-sm font-mono">/api/issues</code>
                </div>
                <span className="text-sm text-gray-600">Create new issue</span>
              </div>
              <div className="p-4">
                <p className="text-gray-700 mb-3">Create a new task or note as GitHub issue</p>
                <div className="bg-gray-50 rounded p-3">
                  <h4 className="font-medium text-sm mb-2">Request Body:</h4>
                  <pre className="text-xs text-gray-700 overflow-x-auto">{`{
  "title": "string",
  "body": "string?",
  "issueType": "Task" | "Note",
  "repo": "string",
  "tags": ["string"]?
}`}</pre>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-orange-50 px-4 py-3 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">POST</span>
                  <code className="text-sm font-mono">/api/issues/{'{issue_number}'}</code>
                </div>
                <span className="text-sm text-gray-600">Update issue</span>
              </div>
              <div className="p-4">
                <p className="text-gray-700">Update issue state, labels, or other properties</p>
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-orange-50 px-4 py-3 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">POST</span>
                  <code className="text-sm font-mono">/api/issues/{'{issue_number}'}/comments</code>
                </div>
                <span className="text-sm text-gray-600">Add comment</span>
              </div>
              <div className="p-4">
                <p className="text-gray-700 mb-3">Add a comment to an existing issue</p>
                <div className="bg-gray-50 rounded p-3">
                  <h4 className="font-medium text-sm mb-2">Request Body:</h4>
                  <pre className="text-xs text-gray-700">{`{
  "body": "string"
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Repositories */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Repositories</h2>
          <div className="space-y-4">
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-green-50 px-4 py-3 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">GET</span>
                  <code className="text-sm font-mono">/api/repos</code>
                </div>
                <span className="text-sm text-gray-600">List repositories</span>
              </div>
              <div className="p-4">
                <p className="text-gray-700">Get list of user&apos;s GitHub repositories (excluding barim-data)</p>
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-green-50 px-4 py-3 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">GET</span>
                  <code className="text-sm font-mono">/api/repos/{'{repository_name}'}</code>
                </div>
                <span className="text-sm text-gray-600">Get repository info</span>
              </div>
              <div className="p-4">
                <p className="text-gray-700">Get detailed information about a specific repository</p>
              </div>
            </div>
          </div>
        </section>

        {/* Status Codes */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Status Codes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">200</span>
                <span className="text-sm">OK - Request successful</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">201</span>
                <span className="text-sm">Created - Resource created</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">400</span>
                <span className="text-sm">Bad Request - Invalid parameters</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">401</span>
                <span className="text-sm">Unauthorized - Invalid token</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="text-center mt-12 pt-8 border-t border-gray-200">
        <p className="text-gray-500 text-sm">
          Base URL: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3001</code>
        </p>
      </div>
    </div>
  );
}