# ADI-2021-2022

Nuestra API REST será un estilo de “Twitter” a pequeña escala, donde tendremos la opción de registrarnos y poder publicar tweets, dar like a tweets, seguir a perfiles de 
otros usuarios y mensajearnos con ellos, entre otras cosas.

## Campos de los recursos

* Usuario: representa al usuario logueado y tiene → id, nickname, password, seguidores (arrays de usuarios), mensajes directos en los que es emisor o receptor, tweets
publicados.
* Mensaje: tendrá el usuario emisor, el receptor, el mensaje y un id asociado.
* Seguimiento: tendrá el usuario seguidor y el usuario al que ha seguido.
* Tweet: id, texto, likes, usuario que lo escribe.
* Like: id, tweet asociado y usuario que da like a ese tweet.
* Destacados: Hereda de tweet y a esta entidad pertenecerán los tweets que más likes tengan.

## Casos de usos

1. Un usuario esté autenticado o no puede acceder al apartado de tweets destacados (con más likes).
2. Un usuario sin estar autenticado puede ver el perfil de otros usuarios, pero no puede ni enviar mensajes directos, ni dar me gusta a sus tweets, ni seguirlo.
3. Un usuario autenticado puede publicar tweets.
4. Un usuario autenticado puede tanto seguir a otro como dejarlo de seguir en caso de que lo siga.
5. Un usuario autenticado puede enviar mensajes directos solamente a los usuarios que siga.
6. Un usuario autenticado puede dar me gusta a cualquier otro tweet.
7. Un usuario autenticado podrá tener acceso a la información de su de su perfil, de sus tweets y de los tweets a los que le ha dado like.
8. Un usuario autenticado puede modificar los datos de su perfil.
9. Un usuario autenticado puede ver los usuarios que han dado me gusta a un tweet, ya sea suyo o de otro usuario.
10. Un usuario autenticado puede ver los tweets a los que le ha dado like otro usuario.
11. Un usuario autenticado puede ver tanto sus seguidores (y sus seguidos) como los de otro usuario.
12. Un usuario autenticado puede ver sus mensajes directos.
13. Un usuario autenticado puede eliminar un tweet que haya publicado, dejar de seguir a otro usuario o quitar un like que hubiera dado a algún tweet.
