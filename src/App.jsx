import "./App.css";
import MainLayout from "./components/MainLayout/MainLayout";
import Dashboard from "./pages/Dashboard/dashboard";
import Calender from "./pages/Calender/calender";
import Notification from "./pages/Notifications/notification";
import Reservation from "./pages/Reservations/reservation";
import Guests from "./pages/Guests/guests";
import GuestServices from "./pages/GuestServices/guestServices";
import EventCalender from "./pages/EventCalender/eventCalender";
import Room from "./pages/Rooms/room";
import Housekeeping from "./pages/Housekeeping/housekeeping";
import Maintenance from "./pages/Maintenance/maintenance";
import Restaurant from "./pages/Restaurant/restaurant";
import Inventory from "./pages/Inventory/inventory";
import Finance from "./pages/Finance/finance";
import Revenue from "./pages/Revenue/revenue";
import Staff from "./pages/Staff/staff";
import Report from "./pages/Reports/report";
import NightAudit from "./pages/NightAudit/nightAudit";
import AccessControl from "./pages/AccessControl/accessControl";
import Settings from "./pages/Settings/setting";
import Integration from "./pages/Integration/integration";
import Support from "./pages/Support/support";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<Calender />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/reservations" element={<Reservation />}>
              <Route path="/reservations/all" element={<Reservation />} />
              <Route path="/reservations/new" element={<Reservation />} />
              <Route path="/reservations/check-in" element={<Reservation />} />
              <Route path="/reservations/check-out" element={<Reservation />} />
              <Route path="/reservations/walk-in" element={<Reservation />} />
              <Route
                path="/reservations/cancellations"
                element={<Reservation />}
              />
            </Route>
            <Route path="/guests" element={<Guests />}>
              <Route path="/guests/directory" element={<Guests />} />
              <Route path="/guests/profiles" element={<Guests />} />
              <Route path="/guests/vip" element={<Guests />} />
              <Route path="/guests/feedback" element={<Guests />} />
              <Route path="/guests/loyalty" element={<Guests />} />
            </Route>
            <Route path="/guest-services" element={<GuestServices />}>
              <Route
                path="/guest-services/requests"
                element={<GuestServices />}
              />
              <Route
                path="/guest-services/room-service"
                element={<GuestServices />}
              />
              <Route
                path="/guest-services/complaints"
                element={<GuestServices />}
              />
              <Route
                path="/guest-services/special-requests"
                element={<GuestServices />}
              />
            </Route>
            <Route path="events/calendar" element={<EventCalender />} />
            <Route path="events/all" element={<EventCalender />} />
            <Route path="events/new" element={<EventCalender />} />
            <Route path="events/venues" element={<EventCalender />} />
            <Route path="events/packages" element={<EventCalender />} />
            <Route path="events/payments" element={<EventCalender />} />
            <Route path="events/enquiries" element={<EventCalender />} />
            <Route path="events/management" element={<EventCalender />} />
            <Route path="/rooms" element={<Room />}>
              <Route path="/rooms/all" element={<Room />} />
              <Route path="/rooms/types" element={<Room />} />
              <Route path="/rooms/availability" element={<Room />} />
              <Route path="/rooms/floors" element={<Room />} />
              <Route path="/rooms/rates" element={<Room />} />
              <Route path="/rooms/restrictions" element={<Room />} />
            </Route>
            <Route path="/housekeeping" element={<Housekeeping />}>
              <Route path="/housekeeping/tasks" element={<Housekeeping />} />
              <Route
                path="/housekeeping/inspections"
                element={<Housekeeping />}
              />
              <Route
                path="/housekeeping/assignments"
                element={<Housekeeping />}
              />
              <Route
                path="/housekeeping/lost-found"
                element={<Housekeeping />}
              />
            </Route>
            <Route path="/maintenance" element={<Maintenance />}>
              <Route path="/maintenance/orders" element={<Maintenance />} />
              <Route path="/maintenance/issues" element={<Maintenance />} />
              <Route path="/maintenance/preventive" element={<Maintenance />} />
            </Route>
            <Route path="/restaurant" element={<Restaurant />}>
              <Route path="/restaurant/orders" element={<Restaurant />} />
              <Route path="/restaurant/menu" element={<Restaurant />} />
              <Route path="/restaurant/tables" element={<Restaurant />} />
              <Route path="/restaurant/kitchen" element={<Restaurant />} />
            </Route>
            <Route path="/inventory" element={<Inventory />}>
              <Route path="/inventory/items" element={<Inventory />} />
              <Route path="/inventory/suppliers" element={<Inventory />} />
              <Route
                path="/inventory/purchase-orders"
                element={<Inventory />}
              />
              <Route path="/inventory/transfers" element={<Inventory />} />
              <Route path="/inventory/low-stock" element={<Inventory />} />
            </Route>
            <Route path="/finance" element={<Finance />}>
              <Route path="/finance/invoices" element={<Finance />} />
              <Route path="/finance/payments" element={<Finance />} />
              <Route path="/finance/refunds" element={<Finance />} />
              <Route path="/finance/expenses" element={<Finance />} />
              <Route path="/finance/taxes" element={<Finance />} />
              <Route path="/finance/cash-book" element={<Finance />} />
            </Route>
            <Route path="/revenue" element={<Revenue />}>
              <Route path="/revenue/pricing" element={<Revenue />} />
              <Route path="/revenue/forecast" element={<Revenue />} />
              <Route path="/revenue/promotions" element={<Revenue />} />
              <Route path="/revenue/corporate-rates" element={<Revenue />} />
            </Route>
            <Route path="/staff" element={<Staff />}>
              <Route path="/staff/departments" element={<Staff />} />
              <Route path="/staff/roles" element={<Staff />} />
              <Route path="/staff/attendance" element={<Staff />} />
              <Route path="/staff/shifts" element={<Staff />} />
              <Route path="/staff/leaves" element={<Staff />} />
              <Route path="/staff/payroll" element={<Staff />} />
            </Route>
            <Route path="/reports" element={<Report />}>
              <Route path="/reports/reservations" element={<Report />} />
              <Route path="/reports/revenue" element={<Report />} />
              <Route path="/reports/occupancy" element={<Report />} />
              <Route path="/reports/guests" element={<Report />} />
              <Route path="/reports/staff" element={<Report />} />
            </Route>
            <Route path="/night-audit" element={<NightAudit />} />
            <Route path="/access-control" element={<AccessControl />}>
              <Route path="/access-control/users" element={<AccessControl />} />
              <Route path="/access-control/roles" element={<AccessControl />} />
              <Route
                path="/access-control/audit-logs"
                element={<AccessControl />}
              />
            </Route>
            <Route path="/settings" element={<Settings />}>
              <Route path="/settings/general" element={<Settings />} />
              <Route path="/settings/property" element={<Settings />} />
              <Route path="/settings/policies" element={<Settings />} />
              <Route path="/settings/rooms" element={<Settings />} />
              <Route path="/settings/bookings" element={<Settings />} />
            </Route>
            <Route path="/integrations" element={<Integration />}>
              <Route
                path="/integrations/channel-manager"
                element={<Integration />}
              />
              <Route path="/integrations/ota" element={<Integration />} />
              <Route path="/integrations/payments" element={<Integration />} />
            </Route>
            <Route path="/support" element={<Support />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
