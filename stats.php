<?php
// Σύνδεση με βάση MySQL
$host = "localhost";
$user = "root";
$password = ""; // Αν δεν έχεις ορίσει κωδικό
$database = "poseidon_stats";

$conn = new mysqli($host, $user, $password, $database);

// Έλεγχος σύνδεσης
if ($conn->connect_error) {
    die("Αποτυχία σύνδεσης: " . $conn->connect_error);
}

// Ερώτημα ανάκτησης δεδομένων
$sql = "SELECT m.match_date, p.name, m.time_played, m.goals, m.assists, m.cards, m.clean_sheet
        FROM match_stats m
        JOIN players p ON m.player_id = p.id
        ORDER BY m.match_date DESC";

$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="el">
<head>
    <meta charset="UTF-8">
    <title>Στατιστικά Παικτών</title>
    <style>
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>Στατιστικά Παικτών ανά Αγώνα</h1>
    <table>
        <thead>
            <tr>
                <th>Ημερομηνία</th>
                <th>Όνομα</th>
                <th>Λεπτά</th>
                <th>Γκολ</th>
                <th>Ασίστ</th>
                <th>Κάρτες</th>
                <th>Clean Sheet</th>
            </tr>
        </thead>
        <tbody>
            <?php
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    echo "<tr>
                            <td>{$row['match_date']}</td>
                            <td>{$row['name']}</td>
                            <td>{$row['time_played']}</td>
                            <td>{$row['goals']}</td>
                            <td>{$row['assists']}</td>
                            <td>{$row['cards']}</td>
                            <td>" . ($row['clean_sheet'] ? '✔' : '—') . "</td>
                          </tr>";
                }
            } else {
                echo "<tr><td colspan='7'>Δεν υπάρχουν διαθέσιμα δεδομένα.</td></tr>";
            }
            ?>
        </tbody>
    </table>
</body>
</html>

<?php $conn->close(); ?>
