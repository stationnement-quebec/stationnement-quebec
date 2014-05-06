$.dateSelector = {

    create: function(){
        $( "#datepicker" ).datetimepicker({
            showButtonPanel: true,
            stepMinute:10,
            onClose: function(dateText, inst){
                $.settings.date = $( "#datepicker" ).datetimepicker( "getDate" );
                $.dateSelector.resetFreeParkings();
            },
        });
    },

    dateActivated: function(){
        $("#datepicker").show();
        $.settings.date=$( "#datepicker" ).datetimepicker( "getDate" );
        if ($.settings.date!=null)
            {
                this.resetFreeParkings();
            }
    },

    dateDeactivated: function(){
        $("#datepicker").hide();
        if ($.settings.date!=null){
            $.settings.date=null;
            $( "#datepicker" ).val('');
            this.resetFreeParkings();
        }
    },

    resetFreeParkings: function(){
        var visibility=$.parkingMap.getObjectTagInformation("free_parking").visible;
        $.parkingMap.deleteObjects("free_parking");
        $.requestHandler.request({id: "free", source: $.freeParkingAPI}, $.main.addMapElement);
        $.parkingMap.toggleFreeParkings(visibility);
    }
}