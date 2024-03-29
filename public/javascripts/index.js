const socket = io();
    const endpoint = 'https://wasah.onrender.com/upload';
    const chatMessages = document.getElementById('publico');

    socket.on('entradaUsuario', (msg) => {
      document.getElementById('numUsuarios').innerHTML=msg;
    });

    socket.on('avisos', (msg) => {
      let p=document.createElement('p');
      p.innerHTML=msg;
      p.classList.add('aviso', 'message');
      chatMessages.appendChild(p);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    socket.on('nuevoUsuario', (usuarios) => {
        const listaUsuarios = document.getElementById('lista');
        listaUsuarios.innerHTML = ''; // Limpiar la lista de usuarios antes de actualizar
        document.getElementById('chats').innerHTML='';

        usuarios.forEach(usuario => {
            // Verificar si el usuario actual es el mismo que el usuario del socket
            if (usuario.id !== socket.id) {
                // Crear un nuevo elemento para mostrar la información del usuario
                const nuevoUsuario = document.createElement('div');
                nuevoUsuario.classList.add('usuario');
                nuevoUsuario.id = 'chat-'+usuario.username;

                const img = document.createElement('img');
                img.src = 'files/' + usuario.profilePic;
                img.alt = usuario.username + ' avatar';
                nuevoUsuario.appendChild(img);

                const nombreUsuario = document.createElement('p');
                nombreUsuario.textContent = usuario.username;
                nuevoUsuario.appendChild(nombreUsuario);

                const estadoUsuario = document.createElement('p');
                estadoUsuario.classList.add('estado')
                estadoUsuario.id=usuario.id;
                estadoUsuario.textContent = usuario.status;
                nuevoUsuario.appendChild(estadoUsuario);

                // Agregar el nuevo usuario al contenedor de usuarios
                listaUsuarios.appendChild(nuevoUsuario);

                nuevoUsuario.addEventListener('click', function() {
                    abrirChat(usuario.id, usuario.username);
                });

                privado = document.createElement('div')
                privado.classList.add('chat-privado');
                privado.id=usuario.username;
                document.getElementById('chats').appendChild(privado);
            }
        });
    });

    socket.on('escribiendo', (msg) => {
      document.getElementById(msg.username).innerHTML=msg.contenido;
    })



    socket.on('mensaje', (msg) => {
      console.log(msg);
      var div = document.createElement('div')
      var p = document.createElement('p');
      p.innerHTML = msg.usuario;
      p.classList.add('nombreUsuario')
      var p2 = document.createElement('p');
      p2.innerHTML = msg.contenido;
      div.appendChild(p)
      div.appendChild(p2)
      div.classList.add('message', 'received-message');
      if(msg.para==socket.username){
        document.getElementById(msg.usuario).appendChild(div);
        document.getElementById(msg.usuario).scrollTop = document.getElementById(msg.usuario).scrollHeight;
      } else if (msg.para=='publico' || msg.para=='deportes' || msg.para=='javascript'){
        document.getElementById(msg.para).appendChild(div);
        document.getElementById(msg.para).scrollTop = document.getElementById(msg.para).scrollHeight;
      }
      
      
    });


    var temporizador="";
    
    document.getElementById('chat-input').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault(); 
        enviar();
        var msg={
          'username' : socket.username,
          'contenido' : socket.status
        }
        socket.emit('escribiendo', msg);
      } else {
        var msg={
          'contenido' : 'Escribiendo...'
        }
        socket.emit('escribiendo', msg)

        if(temporizador){
          clearTimeout(temporizador)
        } 

        temporizador=setTimeout(()=>{
          var msg={
            'username' : socket.username,
            'contenido' : socket.status
          }
          socket.emit('escribiendo', msg);
        }
        , 3000)
      }
    });

    function abrirChat(id, username){
      chatMessages.style.display='none';
      document.getElementById('deportes').style.display='none';
      document.getElementById('javascript').style.display='none';
      document.getElementById('chat-publico').style.backgroundColor='white';
      document.getElementById('chat-deportes').style.backgroundColor='white';
      document.getElementById('chat-javascript').style.backgroundColor='white';

      chats=document.getElementsByClassName('chat-privado')
      if (chats){
        Array.from(chats).forEach(chat => {
          if(chat.id!=username){
            chat.style.display='none';
            document.getElementById('chat-'+chat.id).style.backgroundColor='white';
          }else{
            chat.style.display='flex';
            document.getElementById('chat-'+chat.id).style.backgroundColor='gainsboro';
          }
        });
      }
      
      document.getElementById('chat-header').innerHTML=username;
      document.getElementById('send-button').value=username;
    }

    function abrirGrupo(grupo){
      chats=document.getElementsByClassName('chat-privado')
      if (chats){
        Array.from(chats).forEach(chat => {
          chat.style.display='none';
          document.getElementById('chat-'+chat.id).style.backgroundColor='white';
        });
      }
      if(grupo=='publico'){
        document.getElementById('deportes').style.display='none';
        document.getElementById('javascript').style.display='none';
        document.getElementById('chat-deportes').style.backgroundColor='white';
        document.getElementById('chat-javascript').style.backgroundColor='white';
        document.getElementById('chat-header').innerHTML='Wasah';
      } else if(grupo=='deportes'){
        document.getElementById('publico').style.display='none';
        document.getElementById('javascript').style.display='none';
        document.getElementById('chat-publico').style.backgroundColor='white';
        document.getElementById('chat-javascript').style.backgroundColor='white';
        document.getElementById('chat-header').innerHTML='Deportes';
      } else if(grupo=='javascript'){
        document.getElementById('deportes').style.display='none';
        document.getElementById('publico').style.display='none';
        document.getElementById('chat-deportes').style.backgroundColor='white';
        document.getElementById('chat-publico').style.backgroundColor='white';
        document.getElementById('chat-header').innerHTML='JavaScript';
      }

      document.getElementById(grupo).style.display='flex';
      document.getElementById('chat-'+grupo).style.backgroundColor='gainsboro';
      document.getElementById('send-button').value=grupo;
    }

    function enviar() {
      var para=document.getElementById('send-button').value;
      var input = document.getElementById('chat-input').value.trim();
      if (input !== '') {
        var mensaje = {
          contenido : input,
          usuario : socket.username,
          para : para
        };

        var p = document.createElement('p');
        p.textContent = mensaje.contenido;
        p.classList.add('message', 'sent-message');
        document.getElementById(para).appendChild(p);
        document.getElementById(para).scrollTop = document.getElementById(para).scrollHeight;

        socket.emit('mensaje', mensaje);
        document.getElementById('chat-input').value = '';
      }
    }


    function mostrarBotones() {
      if (document.getElementById('imagenes').style.display != 'block') {
        document.getElementById('imagenes').style.display = 'block';
      } else {
        document.getElementById('imagenes').style.display = 'none';
      }
    }

    function enviarImagen(imagen) {
      var para=document.getElementById('send-button').value;
      document.getElementById('imagenes').style.display = 'none';
      var imgSrc = "images/" + imagen;
      var p = document.createElement('p');
      var img = document.createElement('img');
      img.src = imgSrc;
      p.appendChild(img);
      p.classList.add('message', 'sent-message');
      document.getElementById(para).appendChild(p);
      document.getElementById(para).scrollTop = document.getElementById(para).scrollHeight;
      var mensaje = {
          contenido: "<img src=" + imgSrc + ">",
          usuario: socket.username,
          para: para
        };
      socket.emit('mensaje', mensaje);
    }

    document.getElementById('file-input').addEventListener('change', enviarArchivo);

    function enviarArchivo() {
      var para=document.getElementById('send-button').value;
      var fileInput = document.getElementById('file-input');
      var file = fileInput.files[0];

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
          fetch(endpoint, {
            method: 'POST',
            body: formData
          })
          .then (res => {return res.json()})
          .then(data => {
            var fileType = file.type.split('/')[0]; 

            console.log(data)

            var data;
            if (fileType === 'image') {
              data = '<img src="files/' + data.nombre + '">';
            } else {
              data = '<a href="files/' + data.nombre + '" download="' + file.name + '">Descargar ' + file.name + '</a>';
            }
            var p = document.createElement('p');
            p.innerHTML = data;
            p.classList.add('message', 'sent-message');
            document.getElementById(para).appendChild(p);
            document.getElementById(para).scrollTop = document.getElementById(para).scrollHeight;
            var mensaje = {
              contenido: data,
              usuario: socket.username,
              para:para
            };
            socket.emit('mensaje', mensaje);
            document.getElementById('file-input').value='';
          })
          .catch(error => {
            console.error(error);
            alert('Error uploading file');
          });
        };
    }
    


    function registro(){
      event.preventDefault(); // Evitar el envío del formulario
      
      // Obtener los valores del formulario
      var username = document.getElementById('username').value;
      var status = document.getElementById('status').value;
      var profilePic = document.getElementById('profile-pic').files[0];
      
      // Validar que todos los campos estén completos
      if (username !== '' && status !== '' && profilePic) {
        
        const formData = new FormData();
        formData.append('file', profilePic);
          fetch(endpoint, {
            method: 'POST',
            body: formData
          })
          .then(data => {
            var usuario = {
              'username' : username,
              'status' : status,
              'profilePic' : profilePic.name
            };

            // Enviar los datos al servidor
            socket.emit('registroUsuario', usuario);

            socket.on('usuarioNoDisponible', (mensaje) => {
              // Mostrar el mensaje de error en el formulario de registro
              document.getElementById('username-error').textContent = mensaje;
            });

            socket.on('usuarioDisponible', () => {
              socket.username=username;
              socket.status=status;

              document.getElementById('miFoto').src='files/'+usuario.profilePic;
              document.getElementById('miNombre').innerHTML=usuario.username;

              // Ocultar el formulario de registro y mostrar el contenedor del chat
              document.getElementById('registration-container').style.display = 'none';
              document.getElementById('chat-container').style.display = 'flex';
              document.getElementById('publico').style.display = 'flex';
              document.getElementById('usuarios').style.display = 'flex';
              document.getElementById('chat-publico').style.backgroundColor='gainsboro';
            });
            
          })
          .catch(error => {
            console.error(error);
            alert('Error uploading imagen');
          });
      } else {
        alert('Por favor, complete todos los campos.');
      }
    }
