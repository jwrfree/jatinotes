async function checkWpApi() {
  const baseUrl = 'https://jatinotes.com/wp-json/wp/v2';
  try {
    console.log(`Checking API at ${baseUrl}/posts...`);
    const res = await fetch(`${baseUrl}/posts?per_page=1`);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }

    const posts = await res.json();
    if (posts.length > 0) {
      console.log('✅ Success! Found posts.');
      console.log('Sample Post Title:', posts[0].title.rendered);
      console.log('Total Posts Available (Header):', res.headers.get('x-wp-total'));
    } else {
      console.log('⚠️ API accessible but returned no posts.');
    }
  } catch (error) {
    console.error('❌ Error accessing WordPress API:', error);
  }
}

checkWpApi();
