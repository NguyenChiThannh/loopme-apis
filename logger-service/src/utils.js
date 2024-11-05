export function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'short',
        timeStyle: 'medium'
    }).format(date);
}