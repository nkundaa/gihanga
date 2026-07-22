<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'role' => 'nullable|in:customer,seller',
        ];

        if ($request->role === 'seller') {
            $rules['store_name'] = 'required|string|max:255';
            $rules['payment_number'] = 'required|string|max:50';
            $rules['payment_provider'] = 'required|in:mtn,airtel,mixx_by_bank,cash';
        }

        $validated = $request->validate($rules);

        $validated['password'] = Hash::make($validated['password']);
        $validated['role'] ??= 'customer';

        $user = User::create($validated);

        if ($request->role === 'seller') {
            $seller = $user->seller()->create([
                'business_name' => $request->business_name ?? $request->name,
                'phone' => $request->phone,
                'payment_number' => $request->payment_number,
                'payment_provider' => $request->payment_provider,
                'status' => 'pending',
            ]);

            $slug = Str::slug($request->store_name);
            $baseSlug = $slug;
            $counter = 1;
            while (\App\Models\Store::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }

            \App\Models\Store::create([
                'seller_id' => $seller->id,
                'slug' => $slug,
                'name' => $request->store_name,
                'payment_number' => $request->payment_number,
                'payment_provider' => $request->payment_provider,
                'is_active' => false,
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user->load('seller.store'),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user->load('seller.store'),
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()->load('seller.store'),
        ]);
    }
}
