-- Fusiona las variantes de Hospital William Allen Taylor en el cliente principal.
-- Ejecutado en Supabase después de revisión y aprobación explícita.
-- Los valores genéricos serial_number = 'Varios' se convierten en NULL.
-- Los dos taladros con activo compartido se consolidan en un registro canónico.

BEGIN;

CREATE TEMPORARY TABLE _william_duplicates(id uuid PRIMARY KEY) ON COMMIT DROP;
INSERT INTO _william_duplicates(id) VALUES
('ba7260c2-f3fc-461a-9d5c-7380ed2b3fb9'),
('b51881e1-6053-45e9-8a5c-3271a8c2568d'),
('9407181a-a374-42e6-9f18-e4e313dd6954'),
('61cd5412-4812-4565-b38c-b5a3bacff9ed'),
('c662dbd6-887a-456c-9fe8-8fe94e78fe48'),
('e285af1a-cd66-42f9-801d-fc5848ea9375'),
('89e3f4f2-ee93-41c8-afef-7b9471d2d3e4'),
('25192965-a78a-471b-98a4-47f207eeec4c'),
('2b45520e-1ab8-4057-980f-f38f70a27257'),
('aaf957ec-d935-48d8-9589-437d3bd2ff29'),
('d55b0fc6-0c52-404f-a9de-eadbc4b19772');

CREATE TEMPORARY TABLE _william_stats ON COMMIT DROP AS
SELECT
  (SELECT count(*) FROM public.equipment) AS global_equipment_before,
  (SELECT count(*) FROM public.service_reports) AS global_reports_before,
  (SELECT count(*) FROM public.equipment
   WHERE client_id = 'c7d90b7a-fbc7-4826-9f0c-10e8aa6725f5'
      OR client_id IN (SELECT id FROM _william_duplicates)) AS hospital_equipment_before,
  (SELECT count(*) FROM public.service_reports
   WHERE client_id IN (SELECT id FROM _william_duplicates)) AS reports_to_move,
  (SELECT count(*) FROM public.service_reports
   WHERE equipment_id = '74e69cf9-1a1d-421d-8307-85b060cc6dc6') AS equipment_links_to_move;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.clients
    WHERE id = 'c7d90b7a-fbc7-4826-9f0c-10e8aa6725f5'
      AND name = 'Hospital William Allen Taylor'
  ) THEN
    RAISE EXCEPTION 'El cliente principal no coincide con el ID y nombre esperados';
  END IF;

  IF (
    SELECT count(*)
    FROM public.clients c
    JOIN _william_duplicates d ON d.id = c.id
  ) <> 11 THEN
    RAISE EXCEPTION 'No se encontraron exactamente los 11 clientes duplicados esperados';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.equipment
    WHERE id = 'b33c5f77-981f-4313-bd89-db50cae05db6'
  ) OR NOT EXISTS (
    SELECT 1 FROM public.equipment
    WHERE id = '74e69cf9-1a1d-421d-8307-85b060cc6dc6'
  ) THEN
    RAISE EXCEPTION 'No se encontraron los dos taladros que deben consolidarse';
  END IF;
END $$;

SELECT 1
FROM public.clients
WHERE id = 'c7d90b7a-fbc7-4826-9f0c-10e8aa6725f5'
   OR id IN (SELECT id FROM _william_duplicates)
FOR UPDATE;

SELECT 1
FROM public.equipment
WHERE client_id = 'c7d90b7a-fbc7-4826-9f0c-10e8aa6725f5'
   OR client_id IN (SELECT id FROM _william_duplicates)
FOR UPDATE;

UPDATE public.equipment
SET serial_number = NULL
WHERE (
    client_id = 'c7d90b7a-fbc7-4826-9f0c-10e8aa6725f5'
    OR client_id IN (SELECT id FROM _william_duplicates)
  )
  AND lower(btrim(coalesce(serial_number, ''))) = 'varios';

UPDATE public.equipment
SET model = 'TRS+Colibri II',
    asset_number = '1452882-1452886',
    serial_number = NULL
WHERE id = 'b33c5f77-981f-4313-bd89-db50cae05db6';

UPDATE public.service_reports
SET equipment_id = 'b33c5f77-981f-4313-bd89-db50cae05db6'
WHERE equipment_id = '74e69cf9-1a1d-421d-8307-85b060cc6dc6';

DELETE FROM public.equipment
WHERE id = '74e69cf9-1a1d-421d-8307-85b060cc6dc6';

UPDATE public.equipment
SET client_id = 'c7d90b7a-fbc7-4826-9f0c-10e8aa6725f5'
WHERE client_id IN (SELECT id FROM _william_duplicates);

UPDATE public.service_reports
SET client_id = 'c7d90b7a-fbc7-4826-9f0c-10e8aa6725f5'
WHERE client_id IN (SELECT id FROM _william_duplicates);

UPDATE public.clients
SET name = 'Hospital William Allen Taylor',
    active = true
WHERE id = 'c7d90b7a-fbc7-4826-9f0c-10e8aa6725f5';

DELETE FROM public.clients
WHERE id IN (SELECT id FROM _william_duplicates);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.clients c
    JOIN _william_duplicates d ON d.id = c.id
  ) THEN
    RAISE EXCEPTION 'Quedaron clientes duplicados sin eliminar';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.equipment e
    JOIN _william_duplicates d ON d.id = e.client_id
  ) THEN
    RAISE EXCEPTION 'Quedaron equipos vinculados a clientes duplicados';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.service_reports r
    JOIN _william_duplicates d ON d.id = r.client_id
  ) THEN
    RAISE EXCEPTION 'Quedaron reportes vinculados a clientes duplicados';
  END IF;

  IF (SELECT count(*) FROM public.equipment)
     <> (SELECT global_equipment_before - 1 FROM _william_stats) THEN
    RAISE EXCEPTION 'El total de equipos no coincide con la consolidación intencional de dos taladros en uno';
  END IF;

  IF (SELECT count(*) FROM public.service_reports)
     <> (SELECT global_reports_before FROM _william_stats) THEN
    RAISE EXCEPTION 'Cambió la cantidad total de reportes';
  END IF;
END $$;

SELECT
  11 AS clientes_fusionados,
  (SELECT hospital_equipment_before - 3 FROM _william_stats) AS equipos_movidos,
  (SELECT reports_to_move FROM _william_stats) AS reportes_movidos,
  11 AS clientes_eliminados,
  1 AS equipos_consolidados,
  (SELECT equipment_links_to_move FROM _william_stats) AS relaciones_equipo_movidas,
  (SELECT count(*) FROM public.equipment
   WHERE client_id = 'c7d90b7a-fbc7-4826-9f0c-10e8aa6725f5') AS total_final_equipos_hospital,
  (SELECT count(*) FROM public.equipment) AS total_global_equipos,
  (SELECT count(*) FROM public.service_reports) AS total_global_reportes;

COMMIT;
