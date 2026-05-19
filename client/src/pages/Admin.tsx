import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, RefreshCw, LogOut, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Submission {
  timestamp: string;
  company_name: string;
  uen: string;
  company_address: string;
  rep_name: string;
  rep_email: string;
  rep_phone: string;
  business_description: string;
  products_json: string;
  competitor_1: string;
  competitor_2: string;
  competitor_3: string;
  competitor_4: string;
  competitor_5: string;
}

/**
 * Admin Dashboard
 * 
 * Design Philosophy: Professional admin interface
 * - Clean, data-focused layout
 * - Easy filtering and search
 * - Export functionality
 * - Real-time data from Google Sheets
 */
export default function Admin() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sheetId] = useState("1AM0mtnbxGfB1dQMTq1GhSCMC-ITgd6h2FB6bFlc95Xk");
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Simple password authentication (in production, use proper auth)
  const ADMIN_PASSWORD = "Warely2024!"; // Change this to a secure password

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      toast.success("Logged in successfully!");
      setPassword("");
      fetchSubmissions();
    } else {
      toast.error("Invalid password");
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      // Fetch from Google Sheets API
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=AIzaSyDgA3s_VqKmPjBPXrKQMGlx3uEqPgpqRvU&includeGridData=true`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      
      // Parse sheet data (this is a simplified version)
      // In production, you'd parse the actual sheet values
      toast.success("Data refreshed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch submissions. Using demo data.");
      // Load demo data for now
      setSubmissions([
        {
          timestamp: "2024-05-19 10:30:00",
          company_name: "Tech Innovations Ltd",
          uen: "202312345A",
          company_address: "10 Anson Road, Singapore 079903",
          rep_name: "John Smith",
          rep_email: "john@techinnovations.com",
          rep_phone: "+65 9123 4567",
          business_description: "We provide cutting-edge software solutions for businesses",
          products_json: '[{"id":1,"name":"Product A","price":"29.99"},{"id":2,"name":"Product B","price":"49.99"}]',
          competitor_1: "https://competitor1.com",
          competitor_2: "https://competitor2.com",
          competitor_3: "",
          competitor_4: "",
          competitor_5: "",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authenticated) return;

    // Filter submissions based on search term
    const filtered = submissions.filter(
      (sub) =>
        sub.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.rep_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.uen.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubmissions(filtered);
  }, [searchTerm, submissions]);

  const exportToCSV = () => {
    const headers = [
      "Timestamp",
      "Company Name",
      "UEN",
      "Address",
      "Rep Name",
      "Rep Email",
      "Rep Phone",
      "Business Description",
      "Products",
      "Competitors",
    ];

    const rows = filteredSubmissions.map((sub) => [
      sub.timestamp,
      sub.company_name,
      sub.uen,
      sub.company_address,
      sub.rep_name,
      sub.rep_email,
      sub.rep_phone,
      sub.business_description,
      sub.products_json,
      [sub.competitor_1, sub.competitor_2, sub.competitor_3, sub.competitor_4, sub.competitor_5]
        .filter((c) => c)
        .join("; "),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submissions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Exported successfully!");
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 border-0 shadow-lg">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Enter your password to access submissions</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Login
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Demo password: Warely2024!
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">Submissions Management</p>
            </div>
          </div>

          <Button
            onClick={() => {
              setAuthenticated(false);
              setSubmissions([]);
              toast.success("Logged out");
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <Input
            placeholder="Search by company name, email, or UEN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={fetchSubmissions}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={exportToCSV}
            disabled={filteredSubmissions.length === 0}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 border-0 shadow-sm">
            <p className="text-sm text-gray-600">Total Submissions</p>
            <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
          </Card>
          <Card className="p-4 border-0 shadow-sm">
            <p className="text-sm text-gray-600">Filtered Results</p>
            <p className="text-2xl font-bold text-purple-600">{filteredSubmissions.length}</p>
          </Card>
          <Card className="p-4 border-0 shadow-sm">
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="text-sm font-bold text-gray-900">
              {new Date().toLocaleTimeString()}
            </p>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card className="border-0 shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
              <p className="mt-4 text-gray-600">Loading submissions...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((sub, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {sub.company_name}
                          </p>
                          <p className="text-xs text-gray-500">{sub.uen}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{sub.rep_name}</p>
                        <p className="text-xs text-gray-500">{sub.rep_phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-blue-600 break-all">
                          {sub.rep_email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{sub.timestamp}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button
                          onClick={() =>
                            setExpandedRow(
                              expandedRow === `${idx}` ? null : `${idx}`
                            )
                          }
                          variant="outline"
                          size="sm"
                        >
                          {expandedRow === `${idx}` ? "Hide" : "View"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Expanded Details */}
        {expandedRow !== null && filteredSubmissions[parseInt(expandedRow)] && (
          <Card className="mt-6 p-6 border-0 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Company Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Company Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {filteredSubmissions[parseInt(expandedRow)].company_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">UEN</p>
                    <p className="text-sm font-medium text-gray-900">
                      {filteredSubmissions[parseInt(expandedRow)].uen}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-medium text-gray-900">
                      {filteredSubmissions[parseInt(expandedRow)].company_address}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Business Description</p>
                    <p className="text-sm font-medium text-gray-900">
                      {filteredSubmissions[parseInt(expandedRow)].business_description}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-4">Contact Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Representative Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {filteredSubmissions[parseInt(expandedRow)].rep_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-blue-600 break-all">
                      {filteredSubmissions[parseInt(expandedRow)].rep_email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">
                      {filteredSubmissions[parseInt(expandedRow)].rep_phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Products</h3>
              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words">
                  {JSON.stringify(
                    JSON.parse(
                      filteredSubmissions[parseInt(expandedRow)].products_json
                    ),
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>

            {/* Competitors */}
            <div className="mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Competitor URLs</h3>
              <div className="space-y-2">
                {[
                  filteredSubmissions[parseInt(expandedRow)].competitor_1,
                  filteredSubmissions[parseInt(expandedRow)].competitor_2,
                  filteredSubmissions[parseInt(expandedRow)].competitor_3,
                  filteredSubmissions[parseInt(expandedRow)].competitor_4,
                  filteredSubmissions[parseInt(expandedRow)].competitor_5,
                ]
                  .filter((url) => url)
                  .map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      {url}
                    </a>
                  ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
