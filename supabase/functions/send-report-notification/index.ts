import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  try {
    const { record } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: admins, error: adminError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin');

    if (adminError) throw adminError;

    const adminIds = (admins || []).map((a) => a.id);
    const { data: tokens, error: tokenError } = await supabase
      .from('push_tokens')
      .select('expo_push_token')
      .in('user_id', adminIds)
      .eq('is_active', true);

    if (tokenError) throw tokenError;

    const messages = (tokens || []).map((t) => ({
      to: t.expo_push_token,
      sound: 'default',
      title: 'Laporan Baru Masuk',
      body: record?.title || 'Ada laporan baru dari jamaah',
      data: { reportId: record?.id, screen: '/admin/laporan' },
    }));

    if (messages.length) {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messages),
      });
    }

    await supabase.from('notification_logs').insert({
      title: 'Laporan Baru Masuk',
      body: record?.title || 'Ada laporan baru dari jamaah',
      target_scope: 'admins',
      data: record || {},
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: String(error) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
