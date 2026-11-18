create function public.crm_fold(p_text text) returns text language sql immutable set search_path = '' as $$ select replace(replace(translate(lower(coalesce(p_text,'')),'àáâäãåçèéêëìíîïñòóôöõùúûüýÿ','aaaaaaceeeeiiiinooooouuuuyy'),chr(769),''),chr(768),'') $$;
revoke all on function public.crm_fold(text) from public, anon, authenticated;
do $migration$
declare definition text;
begin
 select pg_catalog.pg_get_functiondef('public.crm_snapshot(timestamptz,timestamptz,text,integer,integer)'::regprocedure) into definition;
 if strpos(definition,$old$q text := lower(trim(coalesce(p_query,'')))$old$)=0 or strpos(definition,$old$strpos(lower(concat_ws($old$)=0 then raise exception 'unexpected CRM function source'; end if;
 definition:=replace(definition,$old$q text := lower(trim(coalesce(p_query,'')))$old$,$new$q text := public.crm_fold(trim(coalesce(p_query,'')))$new$);
 definition:=replace(definition,$old$strpos(lower(concat_ws($old$,$new$strpos(public.crm_fold(concat_ws($new$);
 execute definition;
end $migration$;
