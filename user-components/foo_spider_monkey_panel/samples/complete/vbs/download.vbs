If (WScript.Arguments.Count <> 2) Then
	WScript.Quit
End If

url = WScript.Arguments(0)
file = WScript.Arguments(1)

Set fso = CreateObject("Scripting.FileSystemObject")
If fso.FileExists(file) Then
	Set fso = Nothing
	WScript.Quit
End If

Set xmlhttp = CreateObject("MSXML2.XMLHTTP")
xmlhttp.open "GET", url, false
xmlhttp.send()

If xmlhttp.Status = 200 Then
	Set stream = CreateObject("ADODB.Stream")
	stream.Open
	stream.Type = 1
	stream.Write xmlhttp.ResponseBody
	stream.Position = 0
	stream.SaveToFile file
	stream.Close
	Set stream = Nothing
End If

Set fso = Nothing
Set xmlhttp = Nothing
