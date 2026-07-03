<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\AiService; // Your existing service

class AiChatController extends Controller
{
    public function index()
    {
        return inertia('Student/AiChat');
    }

    public function chat(Request $request)
    {
        $request->validate(['message' => 'required|string']);
        
        // Call your AI service
        $response = app(AiService::class)->generateResponse($request->message);

        return response()->json([
            'user' => 'AI',
            'message' => $response,
            'created_at' => now()->toISOString()
        ]);
    }
}