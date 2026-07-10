<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {

        if (!$user->google_id) {
            $user->update([
                'google_id' => $googleUser->getId(),
            ]);
        }

        // Give existing users a default role if they don't have one
        if (!$user->hasAnyRole(['student', 'admin'])) {
            $user->assignRole('student');
        }

    } else {

        $user = User::create([
            'name'      => $googleUser->getName(),
            'email'     => $googleUser->getEmail(),
            'google_id' => $googleUser->getId(),
            'password'  => bcrypt(Str::random(24)),
        ]);

        $user->assignRole('student');
    }

            Auth::login($user);

            if ($user->hasRole('admin')) {
                return redirect()->route('admin.dashboard');
            }

            return redirect()->route('student.dashboard');

        } catch (\Exception $e) {
            return redirect()->route('login')
                ->with('error', 'Google login failed. Please try again.');
        }
    }
}