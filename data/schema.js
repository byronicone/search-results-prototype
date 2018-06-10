module.exports = Object.freeze({
    SITTER: { TYPE: 'sitter', KEYS: ['sitter', 'sitter_phone_number', 'sitter_email', 'sitter_image']},
    OWNER: { TYPE: 'owner', KEYS: ['owner', 'owner_phone_number', 'owner_email', 'owner_image']},
    VISIT: { TYPE: 'visit', KEYS: ['start_date', 'end_date', 'text','rating', 'sitter', 'owner', 'dogs']},
    DOG: { TYPE: 'dog', KEYS: ['dogs', 'owner']},
});
