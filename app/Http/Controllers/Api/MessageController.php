<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function conversations(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user->isSeller()) {
            $store = $user->seller?->store;
            if (!$store) return response()->json(['conversations' => []]);
            $conversations = Conversation::with(['customer', 'lastMessage', 'store'])
                ->where('store_id', $store->id)
                ->latest()
                ->get();
        } else {
            $conversations = Conversation::with(['store', 'lastMessage'])
                ->where('customer_id', $user->id)
                ->latest()
                ->get();
        }
        return response()->json(['conversations' => $conversations]);
    }

    public function show(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();
        $storeId = $user->seller?->store?->id;
        if ($conversation->customer_id !== $user->id && (!$storeId || $conversation->store_id !== $storeId)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $conversation->messages()->where('user_id', '!=', $user->id)->where('is_read', false)->update(['is_read' => true]);
        $messages = $conversation->messages()->with('user')->oldest()->get();
        return response()->json([
            'conversation' => $conversation->load('customer', 'store'),
            'messages' => $messages,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'order_id' => 'nullable|exists:orders,id',
            'subject' => 'nullable|string|max:255',
            'content' => 'required|string',
            'attachments' => 'nullable|array',
        ]);
        $user = $request->user();
        $conversation = Conversation::firstOrCreate(
            ['customer_id' => $user->id, 'store_id' => $validated['store_id'], 'order_id' => $validated['order_id'] ?? null],
            ['subject' => $validated['subject'] ?? null, 'is_closed' => false]
        );
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'user_id' => $user->id,
            'content' => $validated['content'],
            'attachments' => $validated['attachments'] ?? null,
        ]);
        return response()->json([
            'conversation' => $conversation->fresh()->load('customer', 'store'),
            'message' => $message->load('user'),
        ], 201);
    }

    public function reply(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();
        $storeId = $user->seller?->store?->id;
        if ($conversation->customer_id !== $user->id && (!$storeId || $conversation->store_id !== $storeId)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $validated = $request->validate(['content' => 'required|string', 'attachments' => 'nullable|array']);
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'user_id' => $user->id,
            'content' => $validated['content'],
            'attachments' => $validated['attachments'] ?? null,
        ]);
        $conversation->update(['is_closed' => false]);
        return response()->json(['message' => $message->load('user')], 201);
    }

    public function close(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();
        $storeId = $user->seller?->store?->id;
        if ($conversation->customer_id !== $user->id && (!$storeId || $conversation->store_id !== $storeId)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $conversation->update(['is_closed' => true]);
        return response()->json(['message' => 'Conversation closed.']);
    }
}