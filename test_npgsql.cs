using System;
using Npgsql;

class Program
{
    static void Main()
    {
        try
        {
            var builder = new NpgsqlConnectionStringBuilder(""postgres://avnadmin:avns_3kcu8fq7q9-a6j8kjdu@checkiski-db-checkiski.l.aivencloud.com:27728/defaultdb?sslmode=require"");
            Console.WriteLine(""SUCCESS"");
        }
        catch (Exception ex)
        {
            Console.WriteLine(""ERROR: "" + ex.ToString());
        }
    }
}
