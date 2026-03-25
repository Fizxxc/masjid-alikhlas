Deno.serve(async () => {
  try {
    const res = await fetch('https://equran.id/apidev/doa', {
      headers: {
        Accept: 'application/json',
      },
    });

    const text = await res.text();

    return new Response(text, {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: true,
        message: 'Gagal mengambil data doa dari EQuran',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});