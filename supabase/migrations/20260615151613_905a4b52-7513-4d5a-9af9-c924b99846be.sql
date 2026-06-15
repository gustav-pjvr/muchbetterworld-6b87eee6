
CREATE OR REPLACE FUNCTION public.requeue_from_dlq(p_message_id text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pgmq
AS $$
DECLARE
  source_queue text;
  rec record;
  new_payload jsonb;
BEGIN
  IF p_message_id IS NULL OR length(p_message_id) = 0 THEN
    RETURN NULL;
  END IF;

  FOREACH source_queue IN ARRAY ARRAY['transactional_emails', 'auth_emails'] LOOP
    BEGIN
      EXECUTE format(
        'SELECT msg_id, message FROM pgmq.%I WHERE message->>''message_id'' = $1 ORDER BY msg_id DESC LIMIT 1',
        'q_' || source_queue || '_dlq'
      ) INTO rec USING p_message_id;
    EXCEPTION WHEN undefined_table THEN
      CONTINUE;
    END;

    IF rec.msg_id IS NOT NULL THEN
      -- Refresh queued_at so TTL applies from the retry moment.
      new_payload := COALESCE(rec.message, '{}'::jsonb)
        || jsonb_build_object(
             'queued_at',
             to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
           );
      PERFORM pgmq.send(source_queue, new_payload);
      PERFORM pgmq.delete(source_queue || '_dlq', rec.msg_id);
      RETURN source_queue;
    END IF;
  END LOOP;

  RETURN NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.requeue_from_dlq(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.requeue_from_dlq(text) TO service_role;
