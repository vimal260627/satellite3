import React, { useState } from 'react';
import {
  GraduationCap,
  HeartPulse,
  Activity,
  Zap,
  ShieldCheck,
  Server,
  Wifi,
  Radio,
  ArrowRight,
  X
} from 'lucide-react';
import { SchoolData, HospitalData } from '../../types';

interface SchoolHospitalModalProps {
  school: SchoolData | null;
  hospital: HospitalData | null;
  onClose: () => void;
}

export const SchoolHospitalModal: React.FC<SchoolHospitalModalProps> = ({
  school,
  hospital,
  onClose,
}) => {
  const [examActive, setExamActive] = useState(false);
  const [hospitalFailoverActive, setHospitalFailoverActive] = useState(false);

  if (!school && !hospital) return null;

  return (
    <div className="h-full flex flex-col bg-[#FFFFFF] border-l border-[#DDD9D0] text-[#202322] select-none text-xs font-mono overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 bg-[#FAF9F5] border-b border-[#DDD9D0] flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-[#202322] text-[#F5F3EE] flex items-center justify-center text-xs">
            {school ? <GraduationCap className="w-3.5 h-3.5 text-[#0284C7]" /> : <HeartPulse className="w-3.5 h-3.5 text-[#DC2626]" />}
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-[#202322]">
              {school ? 'SCHOOL NETWORK SIMULATION' : 'HOSPITAL TELEMEDICINE NODE'}
            </h2>
            <p className="text-[10px] text-[#767B78]">
              Critical Public Institution Network Profile
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-[#767B78] hover:text-[#202322] hover:bg-[#EFECE6] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* SCHOOL PROFILE */}
        {school && (
          <div className="space-y-4">
            <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#EAE6DD] pb-2">
                <div className="font-bold text-xs text-[#0284C7]">{school.name}</div>
                <span className="text-[9px] bg-[#E0F2FE] text-[#0369A1] px-2 py-0.5 rounded font-bold">
                  {school.connectivity}
                </span>
              </div>
              <div className="text-[10px] text-[#767B78]">{school.locationName} • {school.state}</div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded border border-[#E5E1D8]">
                  <span className="text-[9px] text-[#767B78] block">STUDENTS ENROLLED</span>
                  <span className="text-sm font-bold text-[#202322]">{school.students}</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E5E1D8]">
                  <span className="text-[9px] text-[#767B78] block">TEACHERS & STAFF</span>
                  <span className="text-sm font-bold text-[#202322]">{school.teachers}</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E5E1D8]">
                  <span className="text-[9px] text-[#767B78] block">CURRENT ACTIVE USERS</span>
                  <span className="text-sm font-bold text-[#202322]">{school.currentUsers}</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E5E1D8]">
                  <span className="text-[9px] text-[#767B78] block">PEAK CAPACITY</span>
                  <span className="text-sm font-bold text-[#202322]">{school.peakDemandMbps} Mbps</span>
                </div>
              </div>

              {/* Demand Display */}
              <div className="p-3 bg-white rounded border border-[#E5E1D8] space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] text-[#767B78]">BANDWIDTH DEMAND:</span>
                  <span className="font-mono text-sm font-bold text-[#202322]">
                    {examActive ? '48 → 320 Mbps (SURGE)' : `${school.currentDemandMbps} Mbps`}
                  </span>
                </div>
                <div className="w-full bg-[#E5E1D8] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${examActive ? 'bg-[#DC2626]' : 'bg-[#0284C7]'}`}
                    style={{ width: examActive ? '94%' : '24%' }}
                  />
                </div>
              </div>

              {/* Exam Simulation Mode */}
              {examActive ? (
                <div className="p-3 rounded bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] space-y-1.5">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <Zap className="w-4 h-4 text-[#DC2626]" />
                    <span>ONLINE EXAM MODE ACTIVE</span>
                  </div>
                  <div className="text-[10px] space-y-0.5">
                    <div>✓ Bandwidth Reservation: 320 Mbps Dedicated Ka-Band Beam</div>
                    <div>✓ Network Priority: HIGH QoS Class-1 Guaranteed</div>
                    <div>✓ Terrestrial + Satellite Diverse Bonding Active</div>
                  </div>
                  <button
                    onClick={() => setExamActive(false)}
                    className="mt-2 w-full py-1.5 bg-[#202322] text-white rounded text-[10px] font-bold"
                  >
                    DEACTIVATE EXAM MODE
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setExamActive(true)}
                  className="w-full py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded font-mono text-xs font-bold transition-colors flex items-center justify-center space-x-2"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>SIMULATE ONLINE EXAM SPIKE</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* HOSPITAL PROFILE */}
        {hospital && (
          <div className="space-y-4">
            <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#EAE6DD] pb-2">
                <div className="font-bold text-xs text-[#DC2626]">{hospital.name}</div>
                <span className="text-[9px] bg-[#FEE2E2] text-[#991B1B] px-2 py-0.5 rounded font-bold">
                  {hospital.priority}
                </span>
              </div>
              <div className="text-[10px] text-[#767B78]">{hospital.locationName} • {hospital.state}</div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded border border-[#E5E1D8]">
                  <span className="text-[9px] text-[#767B78] block">CONNECTED PATIENTS/USERS</span>
                  <span className="text-sm font-bold text-[#202322]">{hospital.users}</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E5E1D8]">
                  <span className="text-[9px] text-[#767B78] block">TELEMEDICINE SESSION</span>
                  <span className="text-sm font-bold text-[#15803D]">LIVE ACTIVE</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E5E1D8]">
                  <span className="text-[9px] text-[#767B78] block">REQUIRED BANDWIDTH</span>
                  <span className="text-sm font-bold text-[#202322]">{hospital.currentDemandMbps} Mbps</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E5E1D8]">
                  <span className="text-[9px] text-[#767B78] block">SERVICE PRIORITY</span>
                  <span className="text-sm font-bold text-[#DC2626]">CRITICAL ZERO-LOSS</span>
                </div>
              </div>

              {/* Redundant Bearer Paths */}
              <div className="p-3 bg-white rounded border border-[#E5E1D8] space-y-1.5 text-[11px]">
                <div className="text-[10px] text-[#767B78] uppercase font-bold mb-1">
                  HYBRID REDUNDANCY STATUS
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Server className="w-3 h-3 text-[#7C3AED]" />
                    <span>Primary Fiber Link:</span>
                  </span>
                  <span className={`font-bold ${hospitalFailoverActive ? 'text-[#DC2626]' : 'text-[#15803D]'}`}>
                    {hospitalFailoverActive ? 'SEVERED' : 'ONLINE'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Wifi className="w-3 h-3 text-[#D97706]" />
                    <span>Satellite Ku/Ka Standby:</span>
                  </span>
                  <span className={`font-bold ${hospitalFailoverActive ? 'text-[#15803D]' : 'text-[#D97706]'}`}>
                    {hospitalFailoverActive ? 'HOT ACTIVE (FAILOVER)' : 'HOT STANDBY'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Radio className="w-3 h-3 text-[#16A34A]" />
                    <span>Cellular Macro:</span>
                  </span>
                  <span className="font-bold text-[#16A34A]">SECONDARY PATH OK</span>
                </div>
              </div>

              {hospitalFailoverActive ? (
                <div className="p-3 rounded bg-[#DCFCE7] border border-[#86EFAC] text-[#14532D] space-y-1">
                  <div className="font-bold flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                    <span>TELEMEDICINE SESSION PROTECTED</span>
                  </div>
                  <div className="text-[10px] text-[#166534]">
                    Fiber disruption detected. Autonomous sub-10ms packet failover directed to LEO Satellite beam. Zero video drop.
                  </div>
                  <button
                    onClick={() => setHospitalFailoverActive(false)}
                    className="mt-2 w-full py-1.5 bg-[#202322] text-white rounded text-[10px] font-bold"
                  >
                    RESET TO PRIMARY FIBER
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setHospitalFailoverActive(true)}
                  className="w-full py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded font-mono text-xs font-bold transition-colors flex items-center justify-center space-x-2"
                >
                  <HeartPulse className="w-3.5 h-3.5" />
                  <span>TEST TELEMEDICINE SATELLITE FAILOVER</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
