using System;
class Program
{
    static void Main()
    {
        string connectionString = ""postgres://avnadmin:avns_3kcu8fq7q9-a6j8kjdu@checkiski-db-checkiski.l.aivencloud.com:27728/defaultdb?sslmode"";
        connectionString = connectionString.Trim();
        int index = connectionString.IndexOf(""?sslmode"", StringComparison.OrdinalIgnoreCase);
        if (index >= 0)
        {
            bool hasEquals = connectionString.Length > index + 8 && connectionString[index + 8] == '=';
            if (!hasEquals)
            {
                connectionString = connectionString.Insert(index + 8, ""=Require"");
            }
        }
        Console.WriteLine(""RESULT: "" + connectionString);
    }
}
