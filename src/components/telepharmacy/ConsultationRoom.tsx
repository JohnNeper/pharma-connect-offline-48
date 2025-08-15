import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Video, 
  VideoOff,
  Mic, 
  MicOff,
  Phone,
  PhoneOff,
  MessageCircle,
  Send,
  Paperclip,
  Users,
  Clock,
  FileText,
  Camera,
  Settings,
  Maximize,
  MoreVertical
} from "lucide-react"
import { useTelepharmacy } from "@/contexts/TelepharmacyContext"

export function ConsultationRoom() {
  const { 
    activeConsultation, 
    waitingPatients, 
    chatMessages, 
    sendMessage, 
    endConsultation,
    markMessagesAsRead 
  } = useTelepharmacy()
  
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [consultationNotes, setConsultationNotes] = useState('')
  const [showChat, setShowChat] = useState(true)
  const [showNotes, setShowNotes] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Simuler le flux vidéo
  useEffect(() => {
    if (videoRef.current && isVideoOn) {
      // En production, ici on initialiserait la webcam
      // navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    }
  }, [isVideoOn])

  // Auto-scroll des messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const currentPatient = activeConsultation 
    ? waitingPatients.find(p => p.id === activeConsultation.patientId)
    : null

  const consultationMessages = chatMessages.filter(
    msg => msg.consultationId === activeConsultation?.id
  )

  const handleSendMessage = () => {
    if (newMessage.trim() && activeConsultation) {
      sendMessage(activeConsultation.id, newMessage.trim())
      setNewMessage('')
    }
  }

  const handleEndConsultation = () => {
    if (activeConsultation) {
      endConsultation(activeConsultation.id, consultationNotes)
      setConsultationNotes('')
    }
  }

  const toggleVideo = () => setIsVideoOn(!isVideoOn)
  const toggleAudio = () => setIsAudioOn(!isAudioOn)

  if (!activeConsultation || !currentPatient) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune consultation active</h3>
          <p className="text-muted-foreground mb-4">
            Sélectionnez un patient dans la file d'attente pour commencer une consultation
          </p>
          <Button variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Voir la file d'attente
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* En-tête de consultation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={currentPatient.avatar} />
                <AvatarFallback>
                  {currentPatient.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {currentPatient.name}
                  <Badge variant={activeConsultation.type === 'video' ? 'default' : 'secondary'}>
                    {activeConsultation.type === 'video' ? 'Vidéo' : 
                     activeConsultation.type === 'chat' ? 'Chat' : 'Async'}
                  </Badge>
                </CardTitle>
                <CardDescription className="flex items-center gap-4">
                  <span>{currentPatient.phone}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Consultation en cours depuis {activeConsultation.startTime}
                  </span>
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowNotes(!showNotes)}>
                <FileText className="w-4 h-4 mr-2" />
                Notes
              </Button>
              <Button variant="destructive" onClick={handleEndConsultation}>
                <PhoneOff className="w-4 h-4 mr-2" />
                Terminer
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Zone vidéo principale */}
        <div className="lg:col-span-2 space-y-4">
          {activeConsultation.type === 'video' && (
            <Card>
              <CardContent className="p-0">
                <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  {isVideoOn ? (
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      style={{ transform: 'scaleX(-1)' }}
                    >
                      {/* Placeholder pour la démo */}
                    </video>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-white">
                        <VideoOff className="w-12 h-12 mx-auto mb-4" />
                        <p>Caméra désactivée</p>
                      </div>
                    </div>
                  )}

                  {/* Vidéo patient (picture-in-picture) */}
                  <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
                    <div className="flex items-center justify-center h-full text-white text-xs">
                      Patient
                    </div>
                  </div>

                  {/* Contrôles vidéo */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                      <Button
                        size="sm"
                        variant={isAudioOn ? "secondary" : "destructive"}
                        onClick={toggleAudio}
                        className="rounded-full w-10 h-10 p-0"
                      >
                        {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant={isVideoOn ? "secondary" : "destructive"}
                        onClick={toggleVideo}
                        className="rounded-full w-10 h-10 p-0"
                      >
                        {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full w-10 h-10 p-0"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full w-10 h-10 p-0"
                      >
                        <Maximize className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informations patient */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations patient</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Motif de consultation</h4>
                  <p className="text-sm text-muted-foreground">{currentPatient.reason}</p>
                </div>
                
                {currentPatient.medicalHistory && currentPatient.medicalHistory.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Antécédents médicaux</h4>
                    <div className="flex flex-wrap gap-1">
                      {currentPatient.medicalHistory.map((history, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {history}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {currentPatient.allergies && currentPatient.allergies.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Allergies</h4>
                    <div className="flex flex-wrap gap-1">
                      {currentPatient.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-2">Contact</h4>
                  <p className="text-sm text-muted-foreground">{currentPatient.phone}</p>
                  {currentPatient.email && (
                    <p className="text-sm text-muted-foreground">{currentPatient.email}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel latéral */}
        <div className="space-y-4">
          {/* Chat */}
          {showChat && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96 p-4">
                  <div className="space-y-4">
                    {consultationMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderType === 'pharmacist' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.senderType === 'pharmacist'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes de consultation */}
          {showNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Notes de consultation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Notez ici les observations importantes, recommandations, prescriptions..."
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                <div className="mt-4 text-right">
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Générer un compte-rendu
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Créer une ordonnance
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Camera className="w-4 h-4 mr-2" />
                Prendre une photo
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Paperclip className="w-4 h-4 mr-2" />
                Joindre un document
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Programmer un suivi
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}