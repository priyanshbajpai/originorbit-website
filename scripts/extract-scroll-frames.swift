import Foundation
import AVFoundation
import AppKit
import CoreGraphics

let source = URL(fileURLWithPath: CommandLine.arguments[1])
let destination = URL(fileURLWithPath: CommandLine.arguments[2], isDirectory: true)
let count = Int(CommandLine.arguments[3]) ?? 81
let width = Int(CommandLine.arguments[4]) ?? 960
try FileManager.default.createDirectory(at: destination, withIntermediateDirectories: true)

let generator = AVAssetImageGenerator(asset: AVURLAsset(url: source))
generator.appliesPreferredTrackTransform = true
generator.requestedTimeToleranceBefore = CMTime(seconds: 0.12, preferredTimescale: 600)
generator.requestedTimeToleranceAfter = CMTime(seconds: 0.12, preferredTimescale: 600)

for index in 0..<count {
  let time = 19.95 * Double(index) / Double(count - 1)
  let image = try generator.copyCGImage(at: CMTime(seconds: time, preferredTimescale: 600), actualTime: nil)
  let height = Int((Double(width) * Double(image.height) / Double(image.width)).rounded())
  let colorSpace = CGColorSpaceCreateDeviceRGB()
  guard let context = CGContext(data: nil, width: width, height: height, bitsPerComponent: 8, bytesPerRow: 0, space: colorSpace, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else { fatalError("Cannot create image context") }
  context.interpolationQuality = .high
  context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))
  guard let scaled = context.makeImage(), let jpeg = NSBitmapImageRep(cgImage: scaled).representation(using: .jpeg, properties: [.compressionFactor: 0.72]) else { fatalError("Cannot encode frame") }
  try jpeg.write(to: destination.appendingPathComponent(String(format: "%03d.jpg", index)), options: .atomic)
  if index % 10 == 0 { print("Frame \(index)/\(count - 1)") }
}
