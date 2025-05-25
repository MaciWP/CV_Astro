# Configurar registros DNS para el correo

Para que tu dominio pueda enviar y recibir correos de forma fiable, debes añadir los siguientes registros DNS en el panel de tu proveedor de dominio:

1. **SPF**

   ```txt
   v=spf1 include:_spf.google.com ~all
   ```

   Este registro autoriza a Google Workspace a enviar correos en nombre de tu dominio.

2. **DMARC**

   ```txt
   v=DMARC1; p=none; rua=mailto:dmarc@oriolmacias.dev; pct=100
   ```

   Ayuda a monitorizar la autenticación del correo y a recibir informes en `dmarc@oriolmacias.dev`.

3. **DKIM (opcional para Google Workspace)**

   Google recomienda habilitar DKIM para firmar tus mensajes. Puedes generar la clave desde la consola de administración de Google Workspace y añadir el registro `TXT` correspondiente en tu DNS.

Guarda los cambios y espera a que la propagación del DNS se complete.
