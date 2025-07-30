"use client";

import { useState } from "react";

export default function TestPage() {
  const [email, setEmail] = useState("test@example.com");
  const [name, setName] = useState("Test User");
  const [categories, setCategories] = useState(["artists", "trends"]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/send-test-newsletter-optimized", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          categories,
        }),
      });

      const data = await response.json();
      setResult({ status: response.status, data });
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test Newsletter Subscription</h1>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Categories:</label>
          <div className="space-y-2">
            {["artists", "trends", "movies", "books"].map((cat) => (
              <label key={cat} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={categories.includes(cat)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCategories([...categories, cat]);
                    } else {
                      setCategories(categories.filter((c) => c !== cat));
                    }
                  }}
                />
                <span className="capitalize">{cat}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleTest}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Test Newsletter Subscription"}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded-md">
          <h3 className="font-medium mb-2">Result:</h3>
          <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
