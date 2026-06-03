using System;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Checkiski.Application.Common.Helpers
{
    public class PuzzleValidator
    {
        private readonly string _executablePath;

        public PuzzleValidator(string executablePath = "stockfish.exe")
        {
            _executablePath = executablePath;
        }

        public async Task<bool> IsValidPuzzleAsync(string fen, string solutionFirstMove)
        {
            var psi = new ProcessStartInfo
            {
                FileName = _executablePath,
                UseShellExecute = false,
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                CreateNoWindow = true
            };

            Process? process;
            try
            {
                process = Process.Start(psi);
                if (process == null) return false;
            }
            catch
            {
                return false;
            }

            var input = process.StandardInput;
            var output = process.StandardOutput;

            await input.WriteLineAsync("uci");
            await input.WriteLineAsync("setoption name MultiPV value 2");
            await input.WriteLineAsync($"position fen {fen}");
            await input.WriteLineAsync("go depth 12");

            string? bestMove = null;
            var lines = new Dictionary<int, (int score, string firstMove)>();

            while (true)
            {
                var line = await output.ReadLineAsync();
                if (line == null) break;

                if (line.StartsWith("info depth"))
                {
                    var pvIndex = line.IndexOf(" pv ");
                    if (pvIndex != -1)
                    {
                        var pvSpan = line.Substring(pvIndex + 4);
                        var firstMove = pvSpan.Split(' ', StringSplitOptions.RemoveEmptyEntries)[0];
                        
                        var multipvIndex = line.IndexOf("multipv ");
                        if (multipvIndex != -1)
                        {
                            var multipvStr = line.Substring(multipvIndex + 8).Split(' ', StringSplitOptions.RemoveEmptyEntries)[0];
                            if (int.TryParse(multipvStr, out int multipv))
                            {
                                int score = 0;
                                if (line.Contains("score mate"))
                                {
                                    var mateStr = line.Substring(line.IndexOf("score mate ") + 11).Split(' ', StringSplitOptions.RemoveEmptyEntries)[0];
                                    if (int.TryParse(mateStr, out int mateIn))
                                        score = mateIn > 0 ? 10000 - mateIn : -10000 - mateIn;
                                }
                                else if (line.Contains("score cp"))
                                {
                                    var cpStr = line.Substring(line.IndexOf("score cp ") + 9).Split(' ', StringSplitOptions.RemoveEmptyEntries)[0];
                                    int.TryParse(cpStr, out score);
                                }
                                lines[multipv] = (score, firstMove);
                            }
                        }
                    }
                }
                else if (line.StartsWith("bestmove"))
                {
                    var parts = line.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                    if (parts.Length > 1) bestMove = parts[1];
                    break;
                }
            }

            try { process.Kill(); } catch { }
            process.Dispose();

            if (string.IsNullOrEmpty(bestMove)) return false;
            if (bestMove != solutionFirstMove) return false;

            if (!lines.ContainsKey(1)) return false;

            if (lines[1].score < 150) return false;

            if (lines.ContainsKey(2))
            {
                if (lines[1].score - lines[2].score < 150)
                {
                    return false;
                }
            }

            return true;
        }
    }
}
