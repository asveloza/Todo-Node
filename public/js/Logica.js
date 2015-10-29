$(function()
{
	var nomServicios = [
	                        {
	                            servicio 	: 	"Trae todas las tareas",
	                            urlServicio	: 	"getAllTask",
	                            metodo		: 	"GET"
	                        },
	                        {
	                            servicio 	: 	"Crear una nueva tarea",
	                            urlServicio	: 	"createTask",
	                            metodo		: 	"POST"
	                        },
	                        {
	                            servicio 	: 	"Editar una tarea",
	                            urlServicio	: 	"updateTask",
	                            metodo		: 	"PUT"
	                        },
	                        {
	                            servicio 	: 	"Eliminar Tarea",
	                            urlServicio	: 	"deleteTask",
	                            metodo		: 	"DELETE"
	                        },
	                        {
	                            servicio 	: 	"Trae una sola tarea",
	                            urlServicio	: 	"getTask",
	                            metodo		: 	"GET"
	                        }
	                    ];

	var consumeServicios = function(tipo, val, callback)
	{
	    var servicio = {
	                        url 	: nomServicios[tipo - 1].urlServicio,
	                        metodo	: nomServicios[tipo - 1].metodo,
	                        datos 	: ""
	                    };
	    if(tipo === 4 || tipo === 5)
	    {
	        servicio.url += "/" + val;
	    }
	    else
	    {
	        servicio.datos = val !== "" ? JSON.stringify(val) : "";
	    }
	    //Invocar el servicio...	    
	    $.ajax(
	    {
	        url 		: servicio.url,
	        type 		: servicio.metodo,
	        data 		: servicio.datos,
	        dataType 	: "json",
	        contentType: "application/json; charset=utf-8"
	    }).done(function(data)
	    {
	        listadoTareas = data;
	        F_imprimeTareas();
	    });
	};

	var listadoTareas = [];
//Para cargar la información de localStorage...
	if(localStorage.getItem("listado"))
	{
		var objTMP = eval(localStorage.getItem("listado"));
		var Ta = "";
		for(var i in objTMP)
		{
			var Ta = objTMP.tarea;
			var nuevaTarea = new tarea(Ta);
			listadoTareas.push(nuevaTarea);
		}
	}

	function tarea(n_tarea)
	{
		this.tarea1 = n_tarea;
		//Para devolver los datos del usuario a ser impresos...
		this.imprime = function()
		{
			return	this.tarea1;
		}
	}

	$("#guarda").click(function (event)
	{
		var valorInput = $("#TB_Tarea").val();
		alert(valorInput);
		var nuevaTarea = new tarea(valorInput);
	    listadoTareas.push(nuevaTarea);
	    //listadoTareas.push({tarea1 : nuevaTarea});
	    localStorage.setItem("listado", JSON.stringify(listadoTareas));
		F_imprimeTareas();
	});

var F_imprimeTareas = (function F_imprimeTareas()
	{
		var txt = "<table class = 'table-fill'>" + 
					"<thead><tr>" + 
					"<th>Terminada</th>" + 
					"<th>Tarea</th>" + 
					"<th>Eliminar</th></tr></thead>" + 
					"<tbody class = 'table-hover'>";
		for(var i = 0; i < listadoTareas.length; i++)
		{
			txt += "<tr>";
			var datosTarea = listadoTareas[i].imprime();
			
			//terminada...
			txt += "<td><center>";
			txt += "<img src = 'imagenes/done.png' border = '0' id = 'e_"+i+"'/>";
			txt += "</center</td>";

			txt += "<td><center>"+(datosTarea)+"</center></td>";
		
			//Eliminar...
			txt += "<td><center>";
			txt += "<img src = 'imagenes/eliminar.png' border = '0' id = 'd_"+i+"'/>";
			txt += "</center</td>";
			txt += "</tr>";
		}
		txt += "</tbody></table>";
		$("#imprime").html(txt);
		//Poner las acciones de editar y eliminar...
		for(var i = 0; i < listadoTareas.length; i++)
		{
			
			/*/Editar...
			nom_div("e_" + i).addEventListener('click', function(event)
			{
				var ind = event.target.id.split("_")[1];
				var idUser = listadoTareas[ind].identificacion;
				console.log("Valor de idUser: ", idUser);
				ind = buscaIndice(idUser);
				if(ind >= 0)
				{
					nom_div("identifica").value = listadoTareas[ind].identificacion;
					nom_div("nombre").value = listadoTareas[ind].primernombre;
					nom_div("apellido").value = listadoTareas[ind].primerapellido;
					nom_div("email").value = listadoTareas[ind].email;
					nom_div("fechanace").value = listadoTareas[ind].fechanacimiento;
					indEdita = ind;
				}
				else
				{
					alert("No existe el ID");
				}
			});*/
			//Eliminar...
			$("#d_" + i).click(function (event)
			{
				var ind = event.target.id.split("_")[1];
				var idUser = listadoTareas[ind].tarea1;
				if(confirm("¿Está segur@ de realizar está acción?"))
				{
					ind = buscaIndice(idUser);
					if(ind >= 0)
					{
						listadoTareas.splice(ind, 1);
						localStorage.setItem("listado", JSON.stringify(listadoTareas));
						indEdita = -1;
						F_imprimeTareas();
					}
				}
			});
		}
		return F_imprimeTareas;
	})();

	var buscaIndice = function(id)
	{
		var indice = -1;
		for(var i in listadoTareas)
		{
			if(listadoTareas[i].tarea1 === id)
			{
				indice = i;
				break;
			}
		}
		return indice;
	}


});