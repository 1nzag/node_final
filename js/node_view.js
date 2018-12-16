
// node default option
var NodeWidth = 50;
var NodeHeight = 50;
var NodeColor = "#01DFD7";
var HighlightColor = "#FF00BF";

// node graphic value
var NodeTextleft = 50;
var NodeTextHeight = 50;
var BaseTop = 200;
var BaseLeft = 50;


var NodeId = 0;
var NodeInfo = new Array();
var TreeRoot;

var div_id = 0;


/* node structure
node id
node name
node child (list)
x
y
shape
*/

/* Node management */

/*shape: rect, tri, cir*/

function ListNodes(Node)
{
    var ReturnString = "<li><a href=\"#\" onclick=\"Highlight("+ String(Node.NodeId) + ");\">" + String(Node.NodeId) + ": " + Node.NodeName + "</a></li><ul>"
    var i;
    for(i = 0; i < Node.ChildList.length; i++)
    {
        ReturnString = ReturnString + ListNodes(Node.ChildList[i]);
    }
    ReturnString = ReturnString + "</ul>";
    return ReturnString;
}

function ShowNodes()
{
    var OutputString = "<li>" + ListNodes(TreeRoot) + "</li>";
    var Output = document.getElementById("NodeList");
    Output.innerHTML = OutputString;
}


function CreateNode(NodeName)
{
    var Node = new Object();
    Node.NodeId = NodeId;
    Node.NodeName = NodeName;
    Node.ChildList = new Array();
    Node.x = BaseLeft;
    Node.y = BaseTop;
    Node.Shape = "rect";
    return Node;
}

function FindNodeBaseId(Node, id) // find node recursive
{
    var result;
    var i;
    if(!Node)
    {
        return -1;
    }
    if (Node.NodeId == id)
    {
        return Node;
    }
    for(i = 0; i < Node.ChildList.length; i++)
    {
        result = FindNodeBaseId(Node.ChildList[i], id);
        if (result != -1)
        {
            return result;
        }
    }
    return -1;
}

/* Tree Draw */
function CleanCanvas()
{
    var canvas = document.getElementById("NodeCanvas");
    var context = canvas.getContext("2d");

    context.clearRect(0,0,canvas.width, canvas.height);
    context.beginPath();
}

function DrawTriangle(Color, Width, Height)
{
    var canvas = document.getElementById("NodeCanvas");
    var context = canvas.getContext("2d");

    context.beginPath();
    context.moveTo(Width, Height);
    context.lineTo(Width, Height + 70);
    context.lineTo(Width + 70, Height + 70);

    context.fillStyle = Color;
    context.fill();
}


function DrawRectangle(Color, Width, Height) 
{
    var canvas = document.getElementById("NodeCanvas");
    var context = canvas.getContext("2d");
    context.fillStyle = Color;
    context.fillRect(Width, Height, NodeWidth, NodeHeight);

}


function DisplayNode(lNodeId, lNodename, Width, Height, Color, Shape)
{
    
    var canvas = document.getElementById("NodeCanvas");
    var context = canvas.getContext("2d");
    
    if(Shape == "rect")
    {
        DrawRectangle(Color, Width, Height);
    }
    else if(Shape == "tri")
    {
        DrawTriangle(Color, Width, Height);
    }
    else
    {
        alert("undefined shape");
        return;
    }
    //draw rect
    
    context.fillStyle = "Black";
    context.font = "12px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(String(lNodeId) + ": " + lNodename ,Width + NodeTextleft , Height + NodeTextHeight);
    context.fillText(String(lNodeId) + ": " + lNodename ,Width + NodeTextleft , Height + NodeTextHeight);
    //fill text
}

function DrawNodes(Node, Color)
{
    var i;
    if(Node == TreeRoot)
    {
        CleanCanvas();
    }
    DisplayNode(Node.NodeId, Node.NodeName, Node.x, Node.y, Color, Node.Shape);
    for(i = 0; i < Node.ChildList.length; i++)
    {
        DrawNodes(Node.ChildList[i],Color);
    }
}

/* button Handler */
function CreateRoot()
{
        if(TreeRoot)
        {
            alert("Root node already exist");
            return;
        }
        TreeRoot = CreateNode("Root");
        NodeId = NodeId + 1; //50, 200
        TreeRoot.x = 200;
        TreeRoot.y = 200;
        TreeRoot.Shape = "rect";

        ShowNodes();
        DrawNodes(TreeRoot, NodeColor);
}

function AddNode(pNodeId, InputNodeName, x, y)//, Shape)
{
    var Parent = FindNodeBaseId(TreeRoot, pNodeId);
    if (Parent == -1)
    {
        alert("can't find node Id");
        return;
    }
    
    var NewNode = CreateNode(InputNodeName);
    NewNode.x = x;
    NewNode.y = y;
    NewNode.Shape = "rect";
    Parent.ChildList.push(NewNode);
    NodeId = NodeId + 1;
    //DrawTree(TreeRoot, 0, BaseLeft, BaseTop);
    ShowNodes();
    DrawNodes(TreeRoot, NodeColor);
}

function DeleteRecursive(cNodeId, cNode)
{
    var i;
    if(cNode.ChildList.length == 0)
    {
        return;
    }
    for(i = 0; i < cNode.ChildList.length; i = i + 1)
    {
        if(cNode.ChildList[i].NodeId == cNodeId)
        {
            cNode.ChildList.splice(i,1);
            return;
        }
        DeleteRecursive(cNodeId, cNode.ChildList[i])
    }
}

function DeleteNode(cNodeId)
{
    DeleteRecursive(cNodeId, TreeRoot);
    //DrawTree(TreeRoot, 0, BaseLeft, BaseTop);
    ShowNodes();
    DrawNodes(TreeRoot, NodeColor);
}

function CleanAll()
{
    CleanCanvas();
    TreeRoot = 0;
    NodeId = 0;
}

function TableVal(Node)
{
    var Result = "<table class=\"tttt\"><tr><td>node id</td><td>" + String(Node.NodeId) + "</td></tr>";
    var i;
    Result = Result + "<tr><td>node name</td><td>" + Node.NodeName + "</td></tr>";
    Result = Result + "<tr><td>width</td><td>" + String(Node.x) + "</td></tr>";
    Result = Result + "<tr><td>height</td><td>" + String(Node.y) + "</td></tr></table></br>";
    
    for(i = 0; i < Node.ChildList.length; i++)
    {
        Result = Result + TableVal(Node.ChildList[i]);
    }
    return Result;
}

function Highlight(NodeId)
{
    var TmpNode = FindNodeBaseId(TreeRoot, NodeId);
    var inputstring = TableVal(TmpNode);

    DrawNodes(TreeRoot, NodeColor);
    DrawNodes(TmpNode, HighlightColor);

    window.open("subview.php?value=" + inputstring,"node info", "width=800, height = 700");
    
}
/*Click Method*/
/*
function OpenSubWindow()
{
    var x = event.offsetX;
    var y = event.offsetY;
    var i;
    var div = parent.document.createElement('div')
    var sNode;
    for(i = 0; i < NodeInfo.length; i = i + 1)
    {
        if(x >= NodeInfo[i].x && x <= (NodeInfo[i].x + NodeWidth) && y >= NodeInfo[i].y && y <= (NodeInfo[i].y + NodeHeight))
        {
            sNode = FindNodeBaseId(NodeInfo[i].id);
        }
    }
    if(sNode)
    {
        div.id = "subWindow" + String(div_id);
        div_id += 1;
        div.setAttribute("style", "background-color: rgba(255, 255, 128, 0.5); width = 250; height = 500; position:absolute; left:" + String(x) + ";top:" + String(y));
        div.innerHTML = "<p>**node info**</p><p>node Id: " + String(sNode.NodeId) + "</p><p>Node name:" + sNode.NodeName + "<p><input type = \"button\" value=\"ok\" OnClick=\"ToggleLayer(\'"+ div.id + "\')\">"
    parent.document.getElementsByTagName("body")[0].appendChild(div);
    }
}
*/
