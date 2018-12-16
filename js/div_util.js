
function ToggleLayer(div_id)
{
    var div = document.getElementById(div_id);
    if (div.style.display == "")
    {
        div.style.display = "none";
    }
    else if(div.style.display == "none")
    {
        div.style.display = "";
    }
}

