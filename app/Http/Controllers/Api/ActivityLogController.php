<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityLogResource;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ActivityLog::with('user')->latest();

        if (!$request->user()->isAdmin()) {
            $query->where('user_id', $request->user()->id);
        }

        if ($request->action) {
            $query->where('action', $request->action);
        }

        if ($request->type) {
            $query->where('type', $request->type);
        }

        $logs = $query->paginate(50);

        return response()->json([
            'logs' => ActivityLogResource::collection($logs),
            'total' => $logs->total(),
            'pages' => $logs->lastPage(),
        ]);
    }

    public static function log(
        string $action,
        string $description = null,
        string $type = null,
        $targetId = null,
        string $targetType = null,
        array $metadata = null,
        $user = null
    ): void {
        ActivityLog::create([
            'user_id' => $user?->id ?? auth()->id(),
            'action' => $action,
            'description' => $description,
            'type' => $type,
            'target_id' => $targetId,
            'target_type' => $targetType,
            'metadata' => $metadata,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
