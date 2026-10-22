import Foundation
import AVFoundation
let source = URL(fileURLWithPath: CommandLine.arguments[1])
let output = URL(fileURLWithPath: CommandLine.arguments[2])
let w = Int(CommandLine.arguments[3])!, h = Int(CommandLine.arguments[4])!, bitrate = Int(CommandLine.arguments[5])!
let asset = AVURLAsset(url:source)
try? FileManager.default.removeItem(at:output)
let reader = try AVAssetReader(asset:asset)
let writer = try AVAssetWriter(outputURL:output,fileType:.mp4)
writer.shouldOptimizeForNetworkUse = true
let video = AVAssetReaderTrackOutput(track:asset.tracks(withMediaType:.video)[0],outputSettings:[kCVPixelBufferPixelFormatTypeKey as String:kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange])
video.alwaysCopiesSampleData=false
reader.add(video)
let input = AVAssetWriterInput(mediaType:.video,outputSettings:[AVVideoCodecKey:AVVideoCodecType.h264,AVVideoWidthKey:w,AVVideoHeightKey:h,AVVideoCompressionPropertiesKey:[AVVideoAverageBitRateKey:bitrate,AVVideoProfileLevelKey:AVVideoProfileLevelH264HighAutoLevel,AVVideoMaxKeyFrameIntervalKey:30]])
input.expectsMediaDataInRealTime=false
writer.add(input)
var audio: AVAssetReaderTrackOutput? = nil
var audioInput: AVAssetWriterInput? = nil
if let track=asset.tracks(withMediaType:.audio).first {
  audio = AVAssetReaderTrackOutput(track:track,outputSettings:[AVFormatIDKey:kAudioFormatLinearPCM])
  audio!.alwaysCopiesSampleData=false; reader.add(audio!)
  audioInput = AVAssetWriterInput(mediaType:.audio,outputSettings:[AVFormatIDKey:kAudioFormatMPEG4AAC,AVSampleRateKey:48000,AVNumberOfChannelsKey:2,AVEncoderBitRateKey:128000])
  audioInput!.expectsMediaDataInRealTime=false; writer.add(audioInput!)
}
writer.startWriting(); reader.startReading(); writer.startSession(atSourceTime:.zero)
let group=DispatchGroup()
func transfer(_ stream:AVAssetReaderTrackOutput,_ sink:AVAssetWriterInput,_ name:String) {
  group.enter()
  sink.requestMediaDataWhenReady(on:DispatchQueue(label:name)) {
    while sink.isReadyForMoreMediaData {
      if let sample=stream.copyNextSampleBuffer() {
        if !sink.append(sample) { print("Append failed",writer.error as Any); exit(1) }
      } else { sink.markAsFinished(); group.leave(); break }
    }
  }
}
transfer(video,input,"video")
if let audio=audio,let sink=audioInput { transfer(audio,sink,"audio") }
group.wait()
if reader.status == .failed { print(reader.error as Any); exit(1) }
let done=DispatchSemaphore(value:0)
writer.finishWriting { done.signal() }; done.wait()
guard writer.status == .completed else { print(writer.error as Any); exit(1) }
print("Encoded \(w)x\(h) at \(bitrate) bps")
