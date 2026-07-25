<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function roles(): JsonResponse
    {
        return response()->json([
            'roles' => Role::with('permissions')->get(),
        ]);
    }

    public function permissions(): JsonResponse
    {
        return response()->json([
            'permissions' => Permission::all()->groupBy('group'),
        ]);
    }

    public function assignRole(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = \App\Models\User::findOrFail($request->user_id);
        $role = Role::findOrFail($request->role_id);

        $user->roleRelations()->syncWithoutDetaching([$role->id]);

        $user->update(['role' => $role->name]);

        ActivityLogController::log(
            'role_assigned',
            "Assigned role '{$role->name}' to user {$user->name}",
            'admin',
            $user->id,
            'user'
        );

        return response()->json(['message' => 'Role assigned successfully']);
    }

    public function removeRole(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = \App\Models\User::findOrFail($request->user_id);
        $user->roleRelations()->detach($request->role_id);

        return response()->json(['message' => 'Role removed']);
    }

    public function syncPermissions(Request $request, Role $role): JsonResponse
    {
        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->permissions()->sync($request->permissions);

        ActivityLogController::log(
            'permissions_updated',
            "Updated permissions for role '{$role->name}'",
            'admin',
            $role->id,
            'role'
        );

        return response()->json(['message' => 'Permissions updated', 'role' => $role->load('permissions')]);
    }
}
