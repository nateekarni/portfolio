
try {
    console.log('Attempting to import api/index.js...');
    import('./api/index.js').then(() => {
        console.log('SUCCESS: api/index.js loaded successfully.');
        process.exit(0);
    }).catch(err => {
        console.error('FAIL: Could not load api/index.js');
        console.error(err);
        process.exit(1);
    });
} catch (e) {
    console.error('FAIL: Synchronous error');
    console.error(e);
    process.exit(1);
}
