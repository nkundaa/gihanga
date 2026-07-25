<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'banners' => Banner::active()->get()->map(fn($b) => [
                'id' => $b->id,
                'title' => $b->title,
                'subtitle' => $b->subtitle,
                'image' => $b->image ? asset("storage/$b->image") : null,
                'mobile_image' => $b->mobile_image ? asset("storage/$b->mobile_image") : null,
                'button_text' => $b->button_text,
                'button_link' => $b->button_link,
                'sort_order' => $b->sort_order,
            ]),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'required|image|max:5120',
            'mobile_image' => 'nullable|image|max:5120',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:500',
            'sort_order' => 'integer|min:0',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $data = $request->except(['image', 'mobile_image']);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('banners', 'public');
        }
        if ($request->hasFile('mobile_image')) {
            $data['mobile_image'] = $request->file('mobile_image')->store('banners', 'public');
        }

        $banner = Banner::create($data);

        return response()->json(['banner' => $banner], 201);
    }

    public function update(Request $request, Banner $banner): JsonResponse
    {
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120',
            'mobile_image' => 'nullable|image|max:5120',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:500',
            'sort_order' => 'integer|min:0',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $data = $request->except(['image', 'mobile_image']);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('banners', 'public');
        }
        if ($request->hasFile('mobile_image')) {
            $data['mobile_image'] = $request->file('mobile_image')->store('banners', 'public');
        }

        $banner->update($data);

        return response()->json(['banner' => $banner->fresh()]);
    }

    public function destroy(Banner $banner): JsonResponse
    {
        $banner->delete();
        return response()->json(['message' => 'Banner deleted']);
    }
}
