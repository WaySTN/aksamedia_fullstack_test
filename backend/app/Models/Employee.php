<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Represents an employee within the organization.
 *
 * Each employee belongs to a division and has an optional
 * profile image stored on the public disk.
 *
 * @property string $id UUID primary key
 * @property string|null $image Path to profile image on public disk
 * @property string $name Full name of the employee
 * @property string $phone Contact phone number
 * @property string $division_id UUID of the associated division
 * @property string $position Job position/title
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read \App\Models\Division $division
 */
class Employee extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'image',
        'name',
        'phone',
        'division_id',
        'position',
    ];

    /**
     * Get the division that the employee belongs to.
     */
    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }
}
