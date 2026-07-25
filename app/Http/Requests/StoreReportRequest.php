<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => 'required|string|in:product,store,review,user',
            'target_id' => 'required|integer',
            'reason' => 'required|string|max:500',
            'description' => 'nullable|string|max:2000',
        ];
    }
}
