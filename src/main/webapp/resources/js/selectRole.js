/**
 * select list
 */
function selectQueue(index,roleName) 
	{
		$("#selectedRole").val(roleName);
	
		$.ajax({
            type: "POST",
            cache: false,
            url: 'updateLead',
            data: "selectedRoleId="+ index,
            success: function(response){}
		});
	}