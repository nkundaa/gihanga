<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReportRequest;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Report::with('user');

        if ($request->user()->isAdmin()) {
            if ($request->status) {
                $query->where('status', $request->status);
            }
        } else {
            $query->where('user_id', $request->user()->id);
        }

        return response()->json([
            'reports' => $query->latest()->paginate(20),
        ]);
    }

    public function store(StoreReportRequest $request): JsonResponse
    {
        $report = Report::create([
            'user_id' => $request->user()->id,
            'type' => $request->type,
            'target_id' => $request->target_id,
            'reason' => $request->reason,
            'description' => $request->description,
        ]);

        return response()->json(['report' => $report], 201);
    }

    public function resolve(Request $request, Report $report): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:resolved,dismissed',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $report->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
            'resolved_by' => $request->user()->id,
            'resolved_at' => now(),
        ]);

        if ($report->type === 'product' && $request->status === 'resolved') {
            \App\Models\Product::where('id', $report->target_id)->update(['is_active' => false]);
        }

        return response()->json(['report' => $report->fresh()]);
    }
}
