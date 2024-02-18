const std = @import("std");

pub fn xorEncryptDecrypt(data: []const u8, key: []const u8) ![]u8 {
    const allocator = std.heap.page_allocator;
    var result = try allocator.alloc(u8, data.len);

    // Basic XOR for each byte
    for (data, 0..) |byte, i| {
        result[i] = byte ^ key[i % key.len];
    }

    return result;
}

pub fn main() !void {
    const allocator = std.heap.page_allocator;
    const args = try std.process.argsAlloc(allocator);
    defer std.process.argsFree(allocator, args);

    // Verify correct usage
    if (args.len < 4) {
        std.debug.print("Usage: {s} <key> <input file> <output file>\n", .{args[0]});
        return;
    }

    // Convert the key from string to bytes
    const keyString = args[1];
    var keyBuffer: [256]u8 = undefined; // Temporary buffer for the key
    // Convert the hex string to a byte slice
    const keySlice = try std.fmt.hexToBytes(&keyBuffer, keyString);

    // File paths
    const inputFilePath = args[2];
    const outputFilePath = args[3];

    // Open input file for reading
    const file = try std.fs.cwd().openFile(inputFilePath, .{});
    defer file.close();

    // Get file size and read contents
    const stat = try file.stat();
    var buffer = try allocator.alloc(u8, stat.size);
    defer allocator.free(buffer);

    // It's important to handle or explicitly ignore the return value of readAll
    _ = try file.readAll(buffer);

    // Decrypt the data
    const processedData = try xorEncryptDecrypt(buffer, keySlice);
    defer allocator.free(processedData);

    // Write the decrypted data to the output file
    const outFile = try std.fs.cwd().createFile(outputFilePath, .{ .truncate = true });
    defer outFile.close();

    try outFile.writeAll(processedData);

    std.debug.print("Decryption completed successfully.\n", .{});
}
