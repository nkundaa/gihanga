<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NotificationPreference;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationPreferenceController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $prefs = NotificationPreference::firstOrCreate(
            ['user_id' => $request->user()->id],
            [
                'order_updates' => true,
                'messages' => true,
                'promotions' => false,
                'newsletter' => false,
            ]
        );

        return response()->json(['preferences' => $prefs]);
    }

    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'order_updates' => 'boolean',
            'messages' => 'boolean',
            'promotions' => 'boolean',
            'newsletter' => 'boolean',
        ]);

        $prefs = NotificationPreference::updateOrCreate(
            ['user_id' => $request->user()->id],
            $request->only(['order_updates', 'messages', 'promotions', 'newsletter'])
        );

        return response()->json(['preferences' => $prefs]);
    }
}
