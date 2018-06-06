module.exports = Object.freeze({
    SITTER: { TYPE: 'sitter', KEYS: ['sitter', 'sitter_phone_number', 'sitter_email', 'sitter_image']},
    OWNER: { TYPE: 'owner', KEYS: ['owner', 'owner_phone_number', 'owner_email', 'owner_image', 'dogs']},
    VISIT: { TYPE: 'visit', KEYS: ['start_date', 'end_date', 'text','rating']},
    DOG: { TYPE: 'dog', KEYS: ['dog', 'owner_id']},
    DOG_APPOINTMENT: { TYPE: 'dog_appointment', KEYS: ['dog_id','visit_id']}
});
