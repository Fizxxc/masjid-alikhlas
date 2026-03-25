import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  try {
    const { title, body, target = 'all' } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    let query = supabase.from('push_tokens').select('expo_push_token').eq('is_active', true);

    if (target === 'admins') {
      const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin');
      const ids = (admins || []).map((x) => x.id);
      query = supabase.from('push_tokens').select('expo_push_token').eq('is_active', true).in('user_id', ids);
    }

    const { data: tokens, error } = await query;
    if (error) throw error;

    const messages = (tokens || []).map((t) => ({
      to: t.expo_push_token,
      sound: 'default',
      title,
      body,
      data: { target },
    }));

    if (messages.length) {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messages),
      });
    }

    await supabase.from('notification_logs').insert({
      title,
      body,
      target_scope: target,
      data: { target },
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: String(error) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
