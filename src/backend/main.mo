import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Order "mo:core/Order";

actor {
  type StudySession = {
    subject : Text;
    startTime : Time.Time;
    endTime : Time.Time;
    completed : Bool;
  };

  module StudySession {
    public func compare(session1 : StudySession, session2 : StudySession) : Order.Order {
      switch (Text.compare(session1.subject, session2.subject)) {
        case (#equal) {
          switch (Int.compare(session1.startTime, session2.startTime)) {
            case (#equal) { Int.compare(session1.endTime, session2.endTime) };
            case (order) { order };
          };
        };
        case (order) { order };
      };
    };
  };

  let scheduleMap = Map.empty<Text, StudySession>();

  public shared ({ caller }) func addSession(subject : Text, startTime : Time.Time, endTime : Time.Time) : async () {
    let session = {
      subject;
      startTime;
      endTime;
      completed = false;
    };
    scheduleMap.add(subject, session);
  };

  public shared ({ caller }) func completeSession(subject : Text) : async () {
    switch (scheduleMap.get(subject)) {
      case (?session) {
        let updatedSession = { session with completed = true };
        scheduleMap.add(subject, updatedSession);
      };
      case (null) { Runtime.trap("Session not found") };
    };
  };

  public query ({ caller }) func getAllSessions() : async [StudySession] {
    scheduleMap.values().toArray().sort();
  };

  public query ({ caller }) func calculateCompletionRate() : async Nat {
    let sessions = scheduleMap.values();
    let totalSessions = sessions.size();
    if (totalSessions == 0) {
      return 0;
    };

    let completedCount = sessions.filter(func(session) { session.completed }).size();
    (completedCount * 100) / totalSessions;
  };
};
