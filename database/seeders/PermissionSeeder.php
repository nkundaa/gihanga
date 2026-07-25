<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Product permissions
            ['name' => 'create_product', 'guard_name' => 'web', 'group' => 'products'],
            ['name' => 'edit_product', 'guard_name' => 'web', 'group' => 'products'],
            ['name' => 'delete_product', 'guard_name' => 'web', 'group' => 'products'],
            ['name' => 'publish_product', 'guard_name' => 'web', 'group' => 'products'],
            ['name' => 'archive_product', 'guard_name' => 'web', 'group' => 'products'],

            // Order permissions
            ['name' => 'view_orders', 'guard_name' => 'web', 'group' => 'orders'],
            ['name' => 'manage_orders', 'guard_name' => 'web', 'group' => 'orders'],
            ['name' => 'update_order_status', 'guard_name' => 'web', 'group' => 'orders'],
            ['name' => 'cancel_order', 'guard_name' => 'web', 'group' => 'orders'],
            ['name' => 'refund_order', 'guard_name' => 'web', 'group' => 'orders'],

            // Store permissions
            ['name' => 'create_store', 'guard_name' => 'web', 'group' => 'stores'],
            ['name' => 'edit_store', 'guard_name' => 'web', 'group' => 'stores'],
            ['name' => 'delete_store', 'guard_name' => 'web', 'group' => 'stores'],
            ['name' => 'approve_store', 'guard_name' => 'web', 'group' => 'stores'],
            ['name' => 'suspend_store', 'guard_name' => 'web', 'group' => 'stores'],

            // User permissions
            ['name' => 'view_users', 'guard_name' => 'web', 'group' => 'users'],
            ['name' => 'manage_users', 'guard_name' => 'web', 'group' => 'users'],
            ['name' => 'suspend_user', 'guard_name' => 'web', 'group' => 'users'],

            // Review permissions
            ['name' => 'manage_reviews', 'guard_name' => 'web', 'group' => 'reviews'],
            ['name' => 'moderate_reviews', 'guard_name' => 'web', 'group' => 'reviews'],

            // Report permissions
            ['name' => 'view_reports', 'guard_name' => 'web', 'group' => 'reports'],
            ['name' => 'resolve_reports', 'guard_name' => 'web', 'group' => 'reports'],

            // Dashboard permissions
            ['name' => 'view_dashboard', 'guard_name' => 'web', 'group' => 'dashboard'],
            ['name' => 'view_reports_analytics', 'guard_name' => 'web', 'group' => 'dashboard'],
            ['name' => 'export_data', 'guard_name' => 'web', 'group' => 'dashboard'],

            // Content permissions
            ['name' => 'manage_banners', 'guard_name' => 'web', 'group' => 'content'],
            ['name' => 'manage_featured_items', 'guard_name' => 'web', 'group' => 'content'],
            ['name' => 'manage_promotions', 'guard_name' => 'web', 'group' => 'content'],

            // Messaging permissions
            ['name' => 'send_messages', 'guard_name' => 'web', 'group' => 'messaging'],
            ['name' => 'manage_conversations', 'guard_name' => 'web', 'group' => 'messaging'],

            // System permissions
            ['name' => 'manage_roles', 'guard_name' => 'web', 'group' => 'system'],
            ['name' => 'manage_permissions', 'guard_name' => 'web', 'group' => 'system'],
            ['name' => 'view_activity_logs', 'guard_name' => 'web', 'group' => 'system'],
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(
                ['name' => $perm['name']],
                $perm
            );
        }

        $this->createRoles();
    }

    private function createRoles(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $sellerRole = Role::firstOrCreate(['name' => 'seller', 'guard_name' => 'web']);
        $customerRole = Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'web']);

        // Admin gets all permissions
        $adminRole->permissions()->sync(Permission::pluck('id'));

        // Seller permissions
        $sellerPermissions = Permission::whereIn('group', ['products', 'orders', 'messaging', 'dashboard', 'promotions'])
            ->whereNotIn('name', [
                'approve_store', 'suspend_store', 'delete_store',
                'view_reports', 'resolve_reports',
                'manage_banners', 'manage_featured_items',
                'manage_roles', 'manage_permissions', 'view_activity_logs',
                'manage_users', 'suspend_user', 'view_users',
                'manage_reviews', 'moderate_reviews',
                'refund_order', 'cancel_order',
            ])
            ->pluck('id');

        $sellerRole->permissions()->sync($sellerPermissions);

        // Customer permissions
        $customerPermissions = Permission::whereIn('name', [
            'send_messages', 'view_orders',
        ])->pluck('id');

        $customerRole->permissions()->sync($customerPermissions);
    }
}
