export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">IMAICOM Test Page</h1>
      <p>Environment Variables:</p>
      <ul className="list-disc pl-6 mt-2">
        <li>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Not set'}</li>
        <li>Mapbox Token: {process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? '✓ Set' : '✗ Not set'}</li>
      </ul>
      <div className="mt-4 p-4 bg-green-100 rounded">
        <p>Server is running properly!</p>
      </div>
    </div>
  )
}