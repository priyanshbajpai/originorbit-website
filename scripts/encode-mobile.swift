import Foundation
import AVFoundation

let sourceURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])
try? FileManager.default.removeItem(at: outputURL)

let asset = AVURLAsset(url: sourceURL)
guard let track = asset.tracks(withMediaType: .video).first else {
  fatalError("No video track")
}

let reader = try AVAssetReader(asset: asset)
let output = AVAssetReaderTrackOutput(track: track, outputSettings: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange,
])
output.alwaysCopiesSampleData = false
reader.add(output)

let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264,
  AVVideoWidthKey: 1280,
  AVVideoHeightKey: 720,
  AVVideoCompressionPropertiesKey: [
    AVVideoAverageBitRateKey: 2_100_000,
    AVVideoExpectedSourceFrameRateKey: 24,
    AVVideoMaxKeyFrameIntervalKey: 6,
    AVVideoAllowFrameReorderingKey: false,
    AVVideoProfileLevelKey: AVVideoProfileLevelH264MainAutoLevel,
  ],
])
input.expectsMediaDataInRealTime = false
writer.add(input)

guard reader.startReading(), writer.startWriting() else {
  fatalError("Could not start transcoding: \(reader.error?.localizedDescription ?? writer.error?.localizedDescription ?? "unknown error")")
}
writer.startSession(atSourceTime: .zero)

var count = 0
while let sample = output.copyNextSampleBuffer() {
  while !input.isReadyForMoreMediaData {
    if reader.status == .failed || writer.status == .failed {
      fatalError("Transcoding failed: \(reader.error?.localizedDescription ?? writer.error?.localizedDescription ?? "unknown error")")
    }
    Thread.sleep(forTimeInterval: 0.002)
  }
  guard input.append(sample) else {
    fatalError("Could not encode frame \(count): \(writer.error?.localizedDescription ?? "unknown error")")
  }
  count += 1
}
input.markAsFinished()
let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()
guard writer.status == .completed else {
  fatalError("Could not finish: \(writer.error?.localizedDescription ?? "unknown error")")
}
print("Encoded \(count) frames to \(outputURL.path)")
