import { useState } from "react";
import { useNavigate } from "react-router";

export function meta() {
  return [
    { title: "Login | BaliNook Book Club" },
    { name: "description", content: "Login to BaliNook Book Club." },
  ];
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Simple hash function to obfuscate password in source
  function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Correct password hash (pre-computed, not the password itself)
  const CORRECT_PASSWORD_HASH = 1958505953;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate a small delay for security feel
    await new Promise((resolve) => setTimeout(resolve, 300));

    const passwordHash = simpleHash(password);

    if (passwordHash === CORRECT_PASSWORD_HASH) {
      // Store auth token in sessionStorage (not localStorage for security)
      sessionStorage.setItem("balinook_auth", "verified");
      navigate("/");
    } else {
      setError("Invalid password");
      setPassword("");
    }

    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-lg p-8 ring-1 ring-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BaliNook</h1>
          <p className="text-gray-600 mb-8">Book Club Access</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter password"
                  className="w-full px-4 py-2 pr-16 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((v) => !v)}
                  disabled={isLoading}
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-2 my-1 px-2 rounded-md text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isPasswordVisible ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm font-medium">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
