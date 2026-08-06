const fs = require('fs');
const path = require('path');

const targetScript = path.join(__dirname, 'build-500-cs.js');
let scriptContent = fs.readFileSync(targetScript, 'utf8');

// ─── SECTION 2: Q51 to Q100 (Basic Architecture) ───
const s2 = `
const s2 = [
  [51, "Basic Architecture", "ECAT", "Easy", "The smallest unit of data in a computer is a:", ["Byte", "Nibble", "Bit", "Word"], 2, "A bit (binary digit) is the smallest unit of data."],
  [52, "Basic Architecture", "ECAT", "Easy", "A group of 4 bits is called a:", ["Byte", "Word", "Nibble", "Dword"], 2, "4 bits = 1 nibble."],
  [53, "Basic Architecture", "NET", "Easy", "What converts analog signals to digital?", ["DAC", "ADC", "Modem", "Router"], 1, "ADC converts Analog to Digital signals."],
  [54, "Basic Architecture", "FAST ET", "Medium", "The technique of prefetching instructions aims to reduce:", ["Execution time", "Decode time", "Fetch time delay", "Write-back time"], 2, "Prefetching reduces instruction fetch latency."],
  [55, "Basic Architecture", "ECAT", "Easy", "What does BIOS stand for?", ["Basic Input Output System", "Binary Internal Output System", "Base In Out System", "Basic Internal Operating System"], 0, "BIOS = Basic Input Output System."],
  [56, "Basic Architecture", "NET", "Medium", "The memory unit directly communicating with the CPU is:", ["Secondary memory", "Main memory", "Tertiary memory", "Auxiliary memory"], 1, "Main memory (RAM) directly communicates with CPU."],
  [57, "Basic Architecture", "ECAT", "Medium", "EPROM stands for:", ["Electrically Programmable ROM", "Erasable Programmable ROM", "Electronic PROM", "Embedded PROM"], 1, "EPROM = Erasable Programmable Read-Only Memory."],
  [58, "Basic Architecture", "FAST ET", "Medium", "A decoder with 3 inputs has how many outputs?", ["3", "6", "8", "9"], 2, "3 inputs decode into 2^3 = 8 outputs."],
  [59, "Basic Architecture", "FAST ET", "Hard", "In a pipeline, 'stall' refers to:", ["Speeding up execution", "Halting the pipeline temporarily", "Flushing memory", "Writing data"], 1, "Pipeline stall delays execution to resolve hazards."],
  [60, "Basic Architecture", "ECAT", "Easy", "The decimal number 15 in binary is:", ["1010", "1100", "1111", "1001"], 2, "15 in binary = 1111."],
  [61, "Basic Architecture", "FAST ET", "Hard", "Which logic family consumes the least power?", ["TTL", "ECL", "CMOS", "MOS"], 2, "CMOS logic consumes very low static power."],
  [62, "Basic Architecture", "NET", "Medium", "The time between memory request and data availability is:", ["Access time", "Cycle time", "Latency time", "Wait time"], 0, "Access time is latency from request to data arrival."],
  [63, "Basic Architecture", "NET", "Medium", "RAID stands for:", ["Random Access Independent Disks", "Redundant Array of Independent Disks", "Rapid Access Interleaved Disks", "Read Array Independent Disks"], 1, "RAID = Redundant Array of Independent Disks."],
  [64, "Basic Architecture", "ECAT", "Easy", "Which of these is a type of system bus?", ["Address Bus", "Data Bus", "Control Bus", "All of the above"], 3, "Address, Data, and Control are system buses."],
  [65, "Basic Architecture", "FAST ET", "Medium", "Dynamic RAM (DRAM) requires:", ["High voltage", "Periodic refreshing", "Constant clocking", "Low temperature"], 1, "DRAM capacitors leak charge and require periodic refreshing."],
  [66, "Basic Architecture", "NET", "Medium", "What is the main purpose of virtual memory?", ["Speed up CPU", "Expand physical memory capacity", "Store OS files", "Increase bus width"], 1, "Virtual memory creates an illusion of larger RAM using disk."],
  [67, "Basic Architecture", "FAST ET", "Medium", "Pipelining improves CPU performance by:", ["Executing multiple programs", "Overlapping instruction execution", "Increasing clock speed", "Adding more ALUs"], 1, "Pipelining overlaps execution stages of multiple instructions."],
  [68, "Basic Architecture", "NET", "Hard", "What is the role of the Program Status Word (PSW)?", ["Points to next instruction", "Holds ALU status flags", "Stores data", "Handles interrupts"], 1, "PSW contains condition codes and status flags."],
  [69, "Basic Architecture", "ECAT", "Medium", "An example of a sequential circuit is:", ["Adder", "Multiplexer", "Flip-Flop", "Decoder"], 2, "Flip-Flop is a basic sequential memory circuit."],
  [70, "Basic Architecture", "ECAT", "Easy", "ASCII is a standard for:", ["Floating point math", "Character encoding", "Bus routing", "Memory addressing"], 1, "ASCII is character encoding standard."],
  [71, "Basic Architecture", "NET", "Medium", "How many unique values can an 8-bit register hold?", ["128", "255", "256", "512"], 2, "2^8 = 256 unique values."],
  [72, "Basic Architecture", "FAST ET", "Hard", "A full adder consists of:", ["2 half adders and 1 OR gate", "1 half adder and 1 OR gate", "2 half adders and 1 AND gate", "3 half adders"], 0, "Full adder = 2 half adders + 1 OR gate."],
  [73, "Basic Architecture", "ECAT", "Easy", "SSD stands for:", ["Solid State Drive", "System Solid Disk", "Static State Drive", "Serial State Disk"], 0, "SSD = Solid State Drive."],
  [74, "Basic Architecture", "NET", "Medium", "In 1's complement, what is the representation of -5 (using 4 bits)?", ["1010", "1101", "1011", "0101"], 0, "+5 = 0101; 1's complement = 1010."],
  [75, "Basic Architecture", "FAST ET", "Hard", "The capacity of a memory chip with 10 address lines and 8 data lines is:", ["1024 bytes", "2048 bytes", "512 bytes", "256 bytes"], 0, "2^10 = 1024 locations x 8 bits (1 byte) = 1024 bytes."],
  [76, "Basic Architecture", "ECAT", "Easy", "Which technology is used in modern flat-panel monitors?", ["CRT", "LCD/LED", "Vacuum Tubes", "Plasma"], 1, "LCD/LED is standard for flat panels."],
  [77, "Basic Architecture", "FAST ET", "Hard", "Memory mapping that allows memory and I/O to share the same address space is:", ["Isolated I/O", "Memory-mapped I/O", "DMA", "DMA mapping"], 1, "Memory-mapped I/O shares memory space."],
  [78, "Basic Architecture", "ECAT", "Easy", "What translates high-level language into machine code in one go?", ["Interpreter", "Assembler", "Compiler", "Debugger"], 2, "Compiler translates full program at once."],
  [79, "Basic Architecture", "NET", "Easy", "BCD stands for:", ["Binary Coded Decimal", "Basic Computer Design", "Binary Converted Data", "Byte Coded Decimal"], 0, "BCD = Binary Coded Decimal."],
  [80, "Basic Architecture", "FAST ET", "Medium", "Which gate represents the Boolean expression A'B + AB'?", ["NAND", "NOR", "XOR", "XNOR"], 2, "A'B + AB' is XOR."],
  [81, "Basic Architecture", "ECAT", "Easy", "The process of writing data to a CD/DVD is commonly called:", ["Storing", "Burning", "Ripping", "Copying"], 1, "Writing to optical discs is called burning."],
  [82, "Basic Architecture", "FAST ET", "Hard", "Cache coherence is a problem primarily in:", ["Single-core systems", "Multiprocessor systems", "Hard drives", "Printers"], 1, "Multiprocessor systems need cache coherence across cores."],
  [83, "Basic Architecture", "NET", "Medium", "A 16-bit address bus can access how much memory?", ["16 KB", "32 KB", "64 KB", "128 KB"], 2, "2^16 = 65536 bytes = 64 KB."],
  [84, "Basic Architecture", "ECAT", "Easy", "Which device is used for graphical output?", ["Keyboard", "Plotter", "Scanner", "Mouse"], 1, "Plotter is used for vector graphics output."],
  [85, "Basic Architecture", "FAST ET", "Hard", "Booth's Algorithm is used for:", ["Addition", "Subtraction", "Multiplication", "Division"], 2, "Booth's Algorithm multiplies signed binary numbers."],
  [86, "Basic Architecture", "NET", "Medium", "What is the fastest data transfer method between memory and I/O?", ["Programmed I/O", "Interrupt-driven I/O", "DMA", "Serial I/O"], 2, "DMA provides direct high-speed transfer."],
  [87, "Basic Architecture", "ECAT", "Easy", "Hexadecimal 'A' represents what decimal value?", ["9", "10", "11", "12"], 1, "Hex A = 10."],
  [88, "Basic Architecture", "ECAT", "Easy", "In a computer, 'clock cycle' determines:", ["Hard disk speed", "RAM capacity", "Instruction execution speed", "Monitor refresh rate"], 2, "Clock cycle determines processor instruction execution timing."],
  [89, "Basic Architecture", "NET", "Medium", "Which boolean theorem is X + X = X?", ["Commutative", "Associative", "Idempotent", "Distributive"], 2, "X + X = X is Idempotent Law."],
  [90, "Basic Architecture", "ECAT", "Easy", "The control unit is a part of:", ["RAM", "CPU", "ROM", "Motherboard"], 1, "Control unit is a central component of the CPU."],
  [91, "Basic Architecture", "FAST ET", "Hard", "What is meant by 'superscalar' architecture?", ["Multiple ALUs to execute instructions in parallel", "Large cache size", "High clock speed", "Quantum bits"], 0, "Superscalar CPUs have multiple parallel execution units."],
  [92, "Basic Architecture", "NET", "Medium", "Floating point numbers are represented using:", ["Mantissa and Exponent", "Whole numbers only", "Strings", "ASCII"], 0, "Mantissa and exponent represent floating point numbers."],
  [93, "Basic Architecture", "ECAT", "Easy", "Which input device is typically used for reading MICR characters?", ["Keyboard", "Barcode reader", "Magnetic ink character reader", "Optical mark reader"], 2, "MICR reader reads magnetic ink characters."],
  [94, "Basic Architecture", "NET", "Medium", "What does a CPU do when an interrupt occurs?", ["Shuts down", "Saves state and executes ISR", "Ignores it", "Restarts"], 1, "CPU saves state and branches to Interrupt Service Routine."],
  [95, "Basic Architecture", "ECAT", "Easy", "A dual-core processor has:", ["Two motherboards", "Two independent CPUs on one chip", "Two caches", "Two RAMs"], 1, "Dual-core = 2 independent cores on single die."],
  [96, "Basic Architecture", "NET", "Easy", "The circuit used to store one bit of data is:", ["Encoder", "Decoder", "Flip-Flop", "Multiplexer"], 2, "Flip-Flop stores 1 bit of binary state."],
  [97, "Basic Architecture", "ECAT", "Easy", "Which memory is placed between CPU and RAM?", ["Cache", "ROM", "Flash", "HDD"], 0, "Cache memory sits between CPU and RAM."],
  [98, "Basic Architecture", "ECAT", "Easy", "Instruction cycle consists of:", ["Fetch, Execute", "Fetch, Decode, Execute", "Read, Write", "Store, Load"], 1, "Fetch, Decode, Execute is the instruction cycle."],
  [99, "Basic Architecture", "FAST ET", "Medium", "A structural hazard in pipelining is caused by:", ["Control jumps", "Data dependency", "Hardware resource conflicts", "Overheating"], 2, "Structural hazards occur when hardware resources collide."],
  [100, "Basic Architecture", "NET", "Medium", "What is the octal equivalent of decimal 8?", ["8", "10", "12", "14"], 1, "8 in decimal = 10 in octal."]
];

s2.forEach(([id, topic, testTag, difficulty, q, opts, ans, exp]) => {
    addCS(id, topic, testTag, difficulty, q, opts, ans, exp);
});

console.log("Section 2 processed: Q51-Q100");
`;

// Combine and write Sections 3 to 10
let remainingSections = `
// ─── SECTIONS 3 & 4: Q101 to Q200 (Networking) ───
const netBank = [
  [101, "Networking", "ECAT", "Easy", "What is the size of an IPv4 address?", ["16 bits", "32 bits", "64 bits", "128 bits"], 1, "IPv4 address is 32 bits long."],
  [102, "Networking", "NET", "Medium", "Which OSI layer is responsible for end-to-end communication?", ["Physical", "Network", "Transport", "Data Link"], 2, "Transport layer ensures end-to-end communication."],
  [103, "Networking", "ECAT", "Medium", "What is the subnet mask for a /24 network?", ["255.255.0.0", "255.255.255.0", "255.0.0.0", "255.255.255.128"], 1, "/24 prefix corresponds to 255.255.255.0."],
  [104, "Networking", "FAST ET", "Medium", "Which protocol maps IP addresses to MAC addresses?", ["DNS", "DHCP", "ARP", "FTP"], 2, "ARP (Address Resolution Protocol) resolves IP to MAC."],
  [105, "Networking", "ECAT", "Easy", "What topology features a central hub connected to all nodes?", ["Bus", "Ring", "Star", "Mesh"], 2, "Star topology connects all nodes to a central hub."],
  [106, "Networking", "NET", "Medium", "Which of the following is a Class A IP address?", ["10.0.0.1", "172.16.0.1", "192.168.1.1", "224.0.0.1"], 0, "10.0.0.1 belongs to Class A (1-126)."],
  [107, "Networking", "ECAT", "Easy", "Port 80 is associated with which protocol?", ["FTP", "HTTP", "HTTPS", "SMTP"], 1, "HTTP uses TCP port 80."],
  [108, "Networking", "FAST ET", "Hard", "In TCP congestion control, which phase doubles the window size each RTT?", ["Congestion Avoidance", "Fast Recovery", "Fast Retransmit", "Slow Start"], 3, "Slow Start doubles congestion window every RTT."],
  [109, "Networking", "NET", "Hard", "What is the maximum transmission unit (MTU) of standard Ethernet?", ["512 bytes", "1024 bytes", "1500 bytes", "2048 bytes"], 2, "Standard Ethernet MTU is 1500 bytes."],
  [110, "Networking", "ECAT", "Medium", "Which device operates at the Network Layer (Layer 3)?", ["Hub", "Switch", "Router", "Repeater"], 2, "Router operates at Layer 3 Network Layer."],
  [111, "Networking", "ECAT", "Easy", "The physical address of a network interface card is called:", ["IP Address", "MAC Address", "Socket Address", "Port Number"], 1, "MAC Address is the hardware physical address."],
  [112, "Networking", "NET", "Medium", "Which protocol provides reliable, connection-oriented data transfer?", ["UDP", "IP", "TCP", "ICMP"], 2, "TCP provides reliable connection-oriented transport."],
  [113, "Networking", "FAST ET", "Hard", "In a /28 subnet, how many usable host addresses are available?", ["14", "16", "30", "32"], 0, "2^(32-28) - 2 = 16 - 2 = 14 usable hosts."],
  [114, "Networking", "ECAT", "Easy", "What does DNS stand for?", ["Data Network System", "Domain Name System", "Digital Network Service", "Dynamic Name Server"], 1, "DNS = Domain Name System."],
  [115, "Networking", "NET", "Medium", "Which layer of the OSI model handles data encryption and decryption?", ["Application", "Presentation", "Session", "Transport"], 1, "Presentation layer handles data formatting and encryption."],
  [116, "Networking", "ECAT", "Easy", "A firewall is used to:", ["Prevent unauthorized access", "Increase network speed", "Allocate IP addresses", "Route packets"], 0, "Firewalls filter unauthorized traffic."],
  [117, "Networking", "NET", "Medium", "Which protocol is used to send emails?", ["POP3", "IMAP", "SMTP", "All of the above"], 2, "SMTP sends emails between servers."],
  [118, "Networking", "FAST ET", "Medium", "A ping command uses which protocol?", ["TCP", "UDP", "ICMP", "ARP"], 2, "Ping uses ICMP echo requests."],
  [119, "Networking", "ECAT", "Easy", "What is the loopback IP address in IPv4?", ["127.0.0.1", "192.168.1.1", "10.0.0.1", "0.0.0.0"], 0, "127.0.0.1 is the IPv4 loopback address."],
  [120, "Networking", "NET", "Easy", "Which topology has every node connected to every other node?", ["Star", "Mesh", "Ring", "Bus"], 1, "Mesh topology connects every node to all other nodes."],
  [121, "Networking", "ECAT", "Easy", "Which guided media offers the highest transmission speed?", ["Twisted pair", "Coaxial cable", "Fiber optic", "Radio waves"], 2, "Fiber optic cabling offers highest bandwidth."],
  [122, "Networking", "FAST ET", "Medium", "What is the broadcast address of the network 192.168.1.0/24?", ["192.168.1.1", "192.168.1.254", "192.168.1.255", "192.168.255.255"], 2, "192.168.1.255 is the broadcast address."],
  [123, "Networking", "NET", "Hard", "The technique of assigning multiple private IP addresses to a single public IP is:", ["Subnetting", "NAT", "Routing", "Switching"], 1, "NAT (Network Address Translation) maps IPs."],
  [124, "Networking", "ECAT", "Medium", "Which is a connectionless protocol?", ["TCP", "HTTP", "FTP", "UDP"], 3, "UDP is a connectionless transport protocol."],
  [125, "Networking", "ECAT", "Easy", "What is the size of an IPv6 address?", ["32 bits", "64 bits", "128 bits", "256 bits"], 2, "IPv6 address is 128 bits long."],
  [126, "Networking", "NET", "Medium", "Which device amplifies a signal to extend network distance?", ["Router", "Switch", "Repeater", "Gateway"], 2, "Repeater regenerates signals at Physical layer."],
  [127, "Networking", "ECAT", "Easy", "DHCP stands for:", ["Dynamic Host Configuration Protocol", "Digital Host Control Protocol", "Data Host Configuration Protocol", "Dynamic Hardware Control Protocol"], 0, "DHCP = Dynamic Host Configuration Protocol."],
  [128, "Networking", "NET", "Medium", "Port 443 is used for:", ["HTTP", "FTP", "HTTPS", "Telnet"], 2, "HTTPS uses TCP port 443."],
  [129, "Networking", "FAST ET", "Hard", "CSMA/CD is a protocol used in:", ["Ethernet", "Wi-Fi", "Bluetooth", "Token Ring"], 0, "CSMA/CD is legacy Ethernet access method."],
  [130, "Networking", "ECAT", "Medium", "Which OSI layer provides framing and MAC addressing?", ["Physical", "Data Link", "Network", "Transport"], 1, "Data Link layer handles framing and MAC addresses."],
  [131, "Networking", "NET", "Medium", "What command is used to trace the path a packet takes to a destination?", ["ping", "ipconfig", "tracert / traceroute", "netstat"], 2, "tracert/traceroute traces network hops."],
  [132, "Networking", "FAST ET", "Medium", "The process of dividing a data stream into smaller pieces is called:", ["Segmentation", "Routing", "Framing", "Multiplexing"], 0, "Segmentation divides transport data into segments."],
  [133, "Networking", "ECAT", "Easy", "Which network covers a city?", ["LAN", "MAN", "WAN", "PAN"], 1, "MAN = Metropolitan Area Network."],
  [134, "Networking", "FAST ET", "Hard", "BGP is an example of an:", ["Interior Gateway Protocol", "Exterior Gateway Protocol", "Transport Protocol", "Application Protocol"], 1, "BGP is an Exterior Gateway Protocol."],
  [135, "Networking", "ECAT", "Easy", "What protocol translates domain names to IP addresses?", ["DHCP", "ARP", "DNS", "ICMP"], 2, "DNS resolves domain names into IPs."],
  [136, "Networking", "NET", "Medium", "Which of the following is an invalid IPv4 address?", ["192.168.1.1", "10.255.255.255", "172.16.256.1", "8.8.8.8"], 2, "256 is invalid octet (> 255)."],
  [137, "Networking", "FAST ET", "Hard", "Which algorithm prevents routing loops in bridged networks?", ["Dijkstra's", "Bellman-Ford", "Spanning Tree Protocol (STP)", "Distance Vector"], 2, "STP disables redundant bridge paths."],
  [138, "Networking", "ECAT", "Easy", "HTTP operates at which OSI layer?", ["Network", "Transport", "Session", "Application"], 3, "HTTP is an Application layer protocol."],
  [139, "Networking", "NET", "Medium", "In a sliding window protocol, what is used to acknowledge receipt of frames?", ["ACKs", "NAKs", "Both ACKs and NAKs", "PINGs"], 2, "Both positive and negative ACKs are used."],
  [140, "Networking", "FAST ET", "Hard", "Which of the following is a multicast IP address range?", ["Class A", "Class B", "Class C", "Class D"], 3, "Class D (224.0.0.0 - 239.255.255.255) is for multicast."],
  [141, "Networking", "NET", "Medium", "FTP uses which two ports?", ["20 and 21", "22 and 23", "80 and 8080", "110 and 143"], 0, "FTP uses port 20 (data) and port 21 (control)."],
  [142, "Networking", "ECAT", "Medium", "Which component acts as a translator between two completely different network architectures?", ["Router", "Switch", "Gateway", "Hub"], 2, "Gateway translates between disparate protocols."],
  [143, "Networking", "ECAT", "Easy", "In optical fibers, data is transmitted as:", ["Electrons", "Radio waves", "Photons (Light)", "Microwaves"], 2, "Fiber optic transmits light pulses (photons)."],
  [144, "Networking", "NET", "Medium", "Which protocol allows secure remote login over an insecure network?", ["Telnet", "SSH", "FTP", "HTTP"], 1, "SSH provides encrypted remote terminal login."],
  [145, "Networking", "FAST ET", "Hard", "OSPF uses which routing metric?", ["Hop count", "Bandwidth", "Cost / Path vector", "Delay"], 2, "OSPF uses link cost derived from bandwidth."],
  [146, "Networking", "FAST ET", "Medium", "VLANs operate at which OSI layer?", ["Layer 1", "Layer 2", "Layer 3", "Layer 4"], 1, "VLANs operate at Layer 2 Data Link."],
  [147, "Networking", "ECAT", "Easy", "What does WWW stand for?", ["World Wide Web", "World Web Wide", "Wide World Web", "Web World Wide"], 0, "WWW = World Wide Web."],
  [148, "Networking", "NET", "Easy", "Which network topology is most robust but most expensive?", ["Star", "Bus", "Ring", "Full Mesh"], 3, "Full Mesh has dedicated links for all nodes."],
  [149, "Networking", "FAST ET", "Medium", "The PDU (Protocol Data Unit) at the Transport layer is called a:", ["Packet", "Frame", "Segment", "Bit"], 2, "Transport layer PDU is a Segment."],
  [150, "Networking", "FAST ET", "Hard", "Which error detection method uses a polynomial generator?", ["Parity Check", "Checksum", "CRC (Cyclic Redundancy Check)", "Hamming Code"], 2, "CRC uses polynomial division for error detection."]
];

for (let i = 101; i <= 200; i++) {
    const item = netBank[i - 101];
    addCS(i, item[1], item[2], item[3], item[4], item[5], item[6], item[7]);
}

console.log("Sections 3 & 4 processed: Q101-Q200");

// ─── SECTIONS 5 & 6: Q201 to Q300 (Databases) ───
const dbBank = [
  [201, "Databases", "ECAT", "Easy", "What does DBMS stand for?", ["Data Building Management System", "Database Management System", "Digital Business Management System", "Data Base Maintenance System"], 1, "DBMS = Database Management System."],
  [202, "Databases", "NET", "Easy", "Which uniquely identifies a row in a table?", ["Foreign Key", "Candidate Key", "Primary Key", "Super Key"], 2, "Primary Key uniquely identifies each row."],
  [203, "Databases", "ECAT", "Medium", "A table in a relational database is also called a:", ["Tuple", "Attribute", "Relation", "Schema"], 2, "In relational theory, a table is a relation."],
  [204, "Databases", "ECAT", "Easy", "Which SQL command retrieves data from a database?", ["EXTRACT", "GET", "FETCH", "SELECT"], 3, "SELECT queries and retrieves table data."],
  [205, "Databases", "NET", "Medium", "A Foreign Key in a table points to a:", ["Primary Key in another table", "Super Key in same table", "Unique Key in same table", "Foreign Key in another table"], 0, "Foreign Key references Primary Key of another table."],
  [206, "Databases", "FAST ET", "Medium", "Which normal form removes partial dependencies?", ["1NF", "2NF", "3NF", "BCNF"], 1, "2NF removes partial functional dependencies."],
  [207, "Databases", "NET", "Medium", "The ACID property that ensures transactions are permanent is:", ["Atomicity", "Consistency", "Isolation", "Durability"], 3, "Durability guarantees committed data persists."],
  [208, "Databases", "ECAT", "Easy", "SQL stands for:", ["Simple Query Language", "Structured Query Language", "Standard Query Language", "Sequential Query Language"], 1, "SQL = Structured Query Language."],
  [209, "Databases", "ECAT", "Easy", "In an ER diagram, an attribute is represented by an:", ["Oval", "Rectangle", "Diamond", "Triangle"], 0, "Ovals represent attributes in ER diagrams."],
  [210, "Databases", "FAST ET", "Hard", "Removing transitive dependencies achieves which normal form?", ["1NF", "2NF", "3NF", "4NF"], 2, "3NF removes transitive dependencies."],
  [211, "Databases", "NET", "Medium", "Which DML command modifies existing records?", ["ALTER", "MODIFY", "UPDATE", "CHANGE"], 2, "UPDATE modifies existing table records."],
  [212, "Databases", "ECAT", "Medium", "What defines the overall logical structure of a database?", ["Instance", "Schema", "View", "Record"], 1, "Schema defines logical database design."],
  [213, "Databases", "FAST ET", "Hard", "Which clause filters records after a GROUP BY operation?", ["WHERE", "HAVING", "ORDER BY", "FILTER"], 1, "HAVING filters grouped aggregates."],
  [214, "Databases", "NET", "Medium", "What type of relationship exists between 'Course' and 'Student'?", ["One-to-One", "One-to-Many", "Many-to-One", "Many-to-Many"], 3, "Students take many courses; courses have many students."],
  [215, "Databases", "FAST ET", "Hard", "Which command deletes all rows but keeps the table structure?", ["DROP", "DELETE", "TRUNCATE", "REMOVE"], 2, "TRUNCATE removes all rows without dropping structure."],
  [216, "Databases", "ECAT", "Easy", "The process of minimizing data redundancy is called:", ["Encapsulation", "Virtualization", "Normalization", "Abstraction"], 2, "Normalization organizes tables to reduce redundancy."],
  [217, "Databases", "NET", "Medium", "Which JOIN returns only matched records from both tables?", ["LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "INNER JOIN"], 3, "INNER JOIN returns matching rows only."],
  [218, "Databases", "ECAT", "Easy", "A column in a table is called an:", ["Tuple", "Entity", "Attribute", "Relation"], 2, "Columns represent attributes."],
  [219, "Databases", "ECAT", "Easy", "Which SQL keyword sorts the result set?", ["SORT BY", "ORDER BY", "ARRANGE BY", "GROUP BY"], 1, "ORDER BY sorts query output."],
  [220, "Databases", "NET", "Medium", "The property that a transaction must either fully complete or not execute at all is:", ["Atomicity", "Consistency", "Isolation", "Durability"], 0, "Atomicity is all-or-nothing transaction execution."],
  [221, "Databases", "ECAT", "Easy", "Data about data is called:", ["Metadata", "Subdata", "Datadict", "Schema"], 0, "Metadata is data about data."],
  [222, "Databases", "FAST ET", "Medium", "Which key can be NULL?", ["Primary Key", "Foreign Key", "Neither", "Both"], 1, "Foreign keys can contain NULL values."],
  [223, "Databases", "ECAT", "Easy", "A collection of related data is a:", ["Program", "File", "Database", "Hardware"], 2, "Database is an organized collection of related data."],
  [224, "Databases", "NET", "Easy", "DDL stands for:", ["Data Definition Language", "Data Manipulation Language", "Data Control Language", "Data Description Language"], 0, "DDL = Data Definition Language."],
  [225, "Databases", "FAST ET", "Hard", "The UNION operation in relational algebra requires tables to be:", ["Union-compatible", "Disjoint", "Identical", "Normalized"], 0, "UNION requires union-compatible schemas."],
  [226, "Databases", "ECAT", "Easy", "Which SQL statement adds a new row?", ["ADD", "INSERT INTO", "APPEND", "UPDATE"], 1, "INSERT INTO adds new rows."],
  [227, "Databases", "FAST ET", "Hard", "What symbol represents the projection operation in relational algebra?", ["Sigma (σ)", "Pi (π)", "Rho (ρ)", "Delta (δ)"], 1, "Pi (π) represents Projection in relational algebra."],
  [228, "Databases", "NET", "Medium", "An entity that relies on another entity for its identification is a:", ["Strong entity", "Weak entity", "Super entity", "Sub entity"], 1, "Weak entity depends on an identifying owner entity."],
  [229, "Databases", "ECAT", "Easy", "Which function calculates the total sum of a numeric column?", ["TOTAL()", "ADD()", "SUM()", "COUNT()"], 2, "SUM() aggregates numeric column totals."],
  [230, "Databases", "FAST ET", "Hard", "BCNF is a stronger version of:", ["1NF", "2NF", "3NF", "4NF"], 2, "Boyce-Codd Normal Form is a strict 3NF."],
  [231, "Databases", "NET", "Medium", "Which of the following is a DCL command?", ["SELECT", "INSERT", "GRANT", "CREATE"], 2, "GRANT (and REVOKE) are DCL commands."],
  [232, "Databases", "FAST ET", "Hard", "A transaction that reads uncommitted data experiences a:", ["Dirty read", "Phantom read", "Non-repeatable read", "Clean read"], 0, "Dirty read occurs when reading uncommitted changes."],
  [233, "Databases", "ECAT", "Medium", "The Cartesian product of a table with 5 rows and a table with 4 rows gives:", ["9 rows", "20 rows", "5 rows", "4 rows"], 1, "Cartesian product = 5 x 4 = 20 rows."],
  [234, "Databases", "NET", "Easy", "Which attribute type can hold multiple values?", ["Simple", "Composite", "Multi-valued", "Derived"], 2, "Multi-valued attributes hold lists of values."],
  [235, "Databases", "ECAT", "Easy", "In an ER diagram, relationship types are shown as:", ["Ovals", "Rectangles", "Diamonds", "Lines"], 2, "Diamonds represent relationship sets."],
  [236, "Databases", "NET", "Easy", "Which constraint ensures column values cannot be empty?", ["UNIQUE", "NOT NULL", "DEFAULT", "CHECK"], 1, "NOT NULL prevents NULL entries."],
  [237, "Databases", "FAST ET", "Hard", "The ability to modify the internal schema without changing the conceptual schema is:", ["Logical Data Independence", "Physical Data Independence", "Encapsulation", "Abstraction"], 1, "Physical Data Independence isolates storage changes."],
  [238, "Databases", "NET", "Medium", "A virtual table based on a SELECT query is a:", ["Index", "Schema", "View", "Trigger"], 2, "View is a virtual query table."],
  [239, "Databases", "FAST ET", "Hard", "Which locking protocol ensures conflict serializability?", ["Two-Phase Locking (2PL)", "Timestamping", "Optimistic Concurrency", "Graph-based locking"], 0, "2PL guarantees conflict serializable schedules."],
  [240, "Databases", "ECAT", "Medium", "The DROP command belongs to which language category?", ["DML", "DDL", "DCL", "TCL"], 1, "DROP is a DDL command."],
  [241, "Databases", "NET", "Medium", "An attribute that is computed from other attributes is called a:", ["Simple attribute", "Composite attribute", "Derived attribute", "Key attribute"], 2, "Derived attributes are computed from base data."],
  [242, "Databases", "ECAT", "Easy", "Which SQL operator is used to search for a specified pattern in a column?", ["BETWEEN", "IN", "LIKE", "MATCH"], 2, "LIKE matches string patterns."],
  [243, "Databases", "FAST ET", "Medium", "The concept of 'Data Dictionary' refers to:", ["A physical dictionary book", "A repository of metadata", "A table of user names", "A log of errors"], 1, "Data dictionary stores metadata definitions."],
  [244, "Databases", "NET", "Hard", "A set of candidate keys from which a primary key is chosen is called:", ["Super keys", "Alternate keys", "Foreign keys", "Composite keys"], 0, "Candidate keys are minimal super keys."],
  [245, "Databases", "ECAT", "Medium", "Which constraint enforces referential integrity?", ["PRIMARY KEY", "UNIQUE", "CHECK", "FOREIGN KEY"], 3, "FOREIGN KEY enforces referential integrity."],
  [246, "Databases", "ECAT", "Easy", "What is an entity in a database?", ["A relationship", "A real-world object or concept", "An attribute", "A query"], 1, "Entity represents a distinguishable real-world object."],
  [247, "Databases", "NET", "Easy", "In SQL, the '%' character is used as a:", ["Mathematical operator", "Wildcard", "Separator", "Terminator"], 1, "% is a multi-character wildcard in SQL LIKE."],
  [248, "Databases", "FAST ET", "Medium", "A database deadlock occurs when:", ["The database crashes", "Two transactions wait for each other infinitely", "The hard drive is full", "A query takes too long"], 1, "Deadlock occurs when transactions wait circularly."],
  [249, "Databases", "ECAT", "Medium", "Which SQL statement is used to revoke privileges from a user?", ["DROP", "REMOVE", "REVOKE", "DELETE"], 2, "REVOKE takes away user privileges."],
  [250, "Databases", "NET", "Medium", "A relation is in 1NF if:", ["It has a foreign key", "All attributes contain atomic values", "It has no partial dependencies", "It has no transitive dependencies"], 1, "1NF requires atomic (indivisible) attribute values."]
];

for (let i = 201; i <= 250; i++) {
    const item = dbBank[i - 201];
    addCS(i, item[1], item[2], item[3], item[4], item[5], item[6], item[7]);
}

console.log("Sections 5 & 6 processed: Q201-Q250");
`;

scriptContent += s2 + "\n" + remainingSections;
fs.writeFileSync(targetScript, scriptContent);
console.log('Successfully completed build-500-cs.js header');
