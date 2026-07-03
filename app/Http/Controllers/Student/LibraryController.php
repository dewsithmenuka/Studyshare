<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LibraryController extends Controller
{
    public function index(Request $request)
    {
        $query = Resource::where('user_id', auth()->id());

        // SEARCH logic: Filters by title
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // SEMESTER logic: Filters by exact semester match
        if ($request->filled('semester')) {
            $query->where('semester', $request->semester);
        }

        $resources = $query->latest()->get();

        return Inertia::render('Library', [
            'resources' => $resources,
            'filters' => $request->only(['search', 'semester'])
        ]);
    }

    public function download($id)
{
    $resource = Resource::findOrFail($id);
    // Ensure the user has permission to download if it's private
    if ($resource->user_id !== auth()->id() && $resource->visibility !== 'public') {
        abort(403);
    }
    return response()->download(storage_path('app/' . $resource->file_path));
}

    public function destroy($id)
    {
        $resource = Resource::where('user_id', auth()->id())->findOrFail($id);
        $resource->delete();

        return back()->with('success', 'Resource deleted successfully.');
    }

    public function share($id)
    {
        $resource = Resource::where('user_id', auth()->id())->findOrFail($id);
        
        // Update visibility to 'pending' for admin review
        $resource->update(['visibility' => 'pending']);

        return back()->with('success', 'File submitted for public review.');
    }
}